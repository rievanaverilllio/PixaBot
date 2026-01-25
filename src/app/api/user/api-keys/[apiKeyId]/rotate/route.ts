import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(_req: Request, ctx: { params: Promise<{ apiKeyId: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiKeyId } = await ctx.params;
  const id = Number.parseInt(apiKeyId, 10);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid apiKeyId" }, { status: 400 });

  const existing = await prisma.apiKey.findFirst({ where: { id, userId }, select: { id: true, revokedAt: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.revokedAt) return NextResponse.json({ error: "Key revoked" }, { status: 400 });

  // Generate a new secret and update the stored hash & prefix (rotate)
  const secret = `sk_live_${crypto.randomBytes(24).toString("hex")}`;
  const last4 = secret.slice(-4);
  const prefix = `sk-...${last4}`;
  const keyHash = sha256Hex(secret);

  await prisma.apiKey.update({ where: { id }, data: { keyHash, prefix } });

  return NextResponse.json({ secret });
}
