import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const PACKAGES = [
  { id: 1, title: "Starter", tokens: 500, role: "starter" },
  { id: 2, title: "Pro", tokens: 3000, role: "pro" },
  { id: 3, title: "Business", tokens: 10000, role: "business" },
] as const;

type PackageId = (typeof PACKAGES)[number]["id"];

function getUserIdFromSession(session: unknown): number | null {
  const s = session as { user?: { id?: string } } | null;
  const id = s?.user?.id;
  if (!id) return null;
  const n = Number.parseInt(String(id), 10);
  return Number.isFinite(n) ? n : null;
}

function planRank(role?: string | null) {
  const r = (role ?? "user").toLowerCase();
  if (r === "admin") return 999;
  if (r === "business") return 30;
  if (r === "pro") return 20;
  if (r === "starter") return 10;
  return 0;
}

function parsePackageId(providerRef?: string | null): number | null {
  if (!providerRef) return null;
  const m = providerRef.match(/\bpkg:(\d+):/);
  if (!m) return null;
  const n = Number.parseInt(m[1] ?? "", 10);
  return Number.isFinite(n) ? n : null;
}

export async function POST(_req: NextRequest, ctx: { params: Promise<{ paymentId: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentId: paymentIdRaw } = await ctx.params;
  const paymentId = Number.parseInt(paymentIdRaw, 10);
  if (!Number.isFinite(paymentId)) {
    return NextResponse.json({ error: "Invalid payment id" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId },
    include: { invoice: true, user: { select: { role: true } } },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (payment.status === "succeeded") {
    const wallet = await prisma.tokenWallet.findUnique({ where: { userId } });
    return NextResponse.json({ ok: true, alreadyPaid: true, tokenBalance: wallet?.balance ?? 0, role: payment.user?.role ?? "user" });
  }

  if (payment.status !== "pending") {
    return NextResponse.json({ error: `Payment not payable (status: ${payment.status})` }, { status: 409 });
  }

  const pkgId = parsePackageId(payment.providerRef);
  const pkg = PACKAGES.find((p) => p.id === (pkgId as PackageId));
  if (!pkg) {
    return NextResponse.json({ error: "Unable to resolve package for this payment" }, { status: 500 });
  }

  const currentRole = payment.user?.role ?? "user";
  const nextRole = planRank(pkg.role) > planRank(currentRole) ? pkg.role : currentRole;

  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();

    await tx.payment.update({
      where: { id: paymentId },
      data: { status: "succeeded", updatedAt: now },
      select: { id: true },
    });

    if (payment.invoiceId) {
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: "paid", paidAt: now },
        select: { id: true },
      });
    }

    const wallet = await tx.tokenWallet.upsert({
      where: { userId },
      create: { userId, balance: pkg.tokens },
      update: { balance: { increment: pkg.tokens } },
      select: { balance: true },
    });

    await tx.tokenTransaction.create({
      data: {
        userId,
        type: "topup",
        amount: pkg.tokens,
        note: `Top-up ${pkg.title}`,
        metadata: { packageId: pkg.id, role: pkg.role },
      },
      select: { id: true },
    });

    if (nextRole !== currentRole) {
      await tx.user.update({
        where: { id: userId },
        data: { role: nextRole },
        select: { id: true },
      });
    }

    return { tokenBalance: wallet.balance, role: nextRole, addedTokens: pkg.tokens };
  });

  return NextResponse.json({ ok: true, ...result });
}
