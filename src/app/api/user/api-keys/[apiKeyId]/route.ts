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

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ apiKeyId: string }> },
) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiKeyId } = await ctx.params;
  const apiKeyIdInt = Number.parseInt(apiKeyId, 10);
  if (!Number.isFinite(apiKeyIdInt))
    return NextResponse.json({ error: "Invalid apiKeyId" }, { status: 400 });

  const existing = await prisma.apiKey.findFirst({
    where: { id: apiKeyIdInt, userId },
    select: { id: true, revokedAt: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.revokedAt)
    return NextResponse.json({ ok: true, alreadyRevoked: true });

  await prisma.apiKey.update({
    where: { id: apiKeyIdInt },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
