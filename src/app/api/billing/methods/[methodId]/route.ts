import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

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

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ methodId: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { methodId: raw } = await ctx.params;
  const methodId = Number.parseInt(raw, 10);
  if (!Number.isFinite(methodId)) return NextResponse.json({ error: "Invalid method id" }, { status: 400 });

  const deleted = await prisma.paymentMethod.deleteMany({ where: { id: methodId, userId } });
  if (deleted.count !== 1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ methodId: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { methodId: raw } = await ctx.params;
  const methodId = Number.parseInt(raw, 10);
  if (!Number.isFinite(methodId)) return NextResponse.json({ error: "Invalid method id" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as { setPrimary?: boolean } | null;
  const setPrimary = Boolean(body?.setPrimary);

  if (!setPrimary) return NextResponse.json({ error: "No changes" }, { status: 400 });

  const existing = await prisma.paymentMethod.findFirst({ where: { id: methodId, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.paymentMethod.updateMany({ where: { userId }, data: { isPrimary: false } }),
    prisma.paymentMethod.update({ where: { id: methodId }, data: { isPrimary: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
