import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const PACKAGES = [
  { id: 1, title: "Starter", tokens: 500, priceCents: 500, role: "starter" },
  { id: 2, title: "Pro", tokens: 3000, priceCents: 2500, role: "pro" },
  { id: 3, title: "Business", tokens: 10000, priceCents: 7000, role: "business" },
] as const;

type PackageId = (typeof PACKAGES)[number]["id"];

function getUserIdFromSession(session: unknown): number | null {
  const s = session as { user?: { id?: string } } | null;
  const id = s?.user?.id;
  if (!id) return null;
  const n = Number.parseInt(String(id), 10);
  return Number.isFinite(n) ? n : null;
}

function randomRef() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeInvoiceNumber() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `INV-${yyyy}${mm}${dd}-${randomRef().toUpperCase()}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { packageId?: number; methodId?: string | number }
    | null;

  const packageId = Number(body?.packageId);
  const rawMethod = body?.methodId ?? "card";

  const selected = PACKAGES.find((p) => p.id === (packageId as PackageId));
  if (!selected) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const invoiceNumber = makeInvoiceNumber();
  const providerRef = `pkg:${selected.id}:${randomRef()}`;

  const result = await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        userId,
        number: invoiceNumber,
        status: "pending",
        amountCents: selected.priceCents,
        currency: "USD",
      },
      select: {
        id: true,
        number: true,
        status: true,
        amountCents: true,
        currency: true,
        issuedAt: true,
      },
    });

    // Resolve methodId: if caller passed a numeric payment method id, validate ownership
    let paymentCreateData: any = {
      userId,
      invoiceId: invoice.id,
      methodId: null,
      provider: typeof rawMethod === "string" ? String(rawMethod) : null,
      providerRef,
      status: "pending",
      amountCents: selected.priceCents,
      currency: "USD",
    };

    if (typeof rawMethod === "number" || (typeof rawMethod === "string" && /^\d+$/.test(String(rawMethod)))) {
      const methodIdInt = Number(rawMethod);
      // ensure method belongs to user
      const pm = await tx.paymentMethod.findFirst({ where: { id: methodIdInt, userId } });
      if (pm) {
        paymentCreateData.methodId = pm.id;
        paymentCreateData.provider = pm.provider ?? paymentCreateData.provider;
      }
    }

    const payment = await tx.payment.create({
      data: paymentCreateData,
      select: {
        id: true,
        status: true,
        provider: true,
        providerRef: true,
        amountCents: true,
        currency: true,
        createdAt: true,
      },
    });

    return { invoice, payment, selected };
  });

  return NextResponse.json({
    checkout: {
      package: { id: result.selected.id, title: result.selected.title, tokens: result.selected.tokens, role: result.selected.role },
      invoice: result.invoice,
      payment: { ...result.payment, providerRef: undefined },
    },
  });
}
