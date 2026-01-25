import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

function getUserIdFromSession(session: unknown): number | null {
  const s = session as { user?: { id?: string } } | null;
  const id = s?.user?.id;
  if (!id) return null;
  const n = Number.parseInt(String(id), 10);
  return Number.isFinite(n) ? n : null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const methods = await prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      label: true,
      type: true,
      last4: true,
      isPrimary: true,
      provider: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ methods });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { label?: string; type?: string; last4?: string | null; provider?: string | null }
    | null;

  const label = (body?.label ?? "").toString().trim();
  const type = (body?.type ?? "card").toString().trim();
  const last4 = body?.last4 ? String(body.last4).trim() : null;
  const provider = body?.provider ? String(body.provider).trim() : null;

  if (!label) return NextResponse.json({ error: "Label required" }, { status: 400 });

  const created = await prisma.paymentMethod.create({
    data: {
      userId,
      label,
      type,
      last4,
      provider,
      status: "active",
      isPrimary: false,
    },
    select: {
      id: true,
      label: true,
      type: true,
      last4: true,
      isPrimary: true,
      provider: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ method: created });
}
