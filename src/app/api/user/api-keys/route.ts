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

type CreateBody = { name?: string };

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ apiKeys });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as CreateBody;
  const name = (body.name ?? "New Key").toString().trim() || "New Key";

  const secret = `sk_live_${crypto.randomBytes(24).toString("hex")}`;
  const last4 = secret.slice(-4);
  const prefix = `sk-...${last4}`;
  const keyHash = sha256Hex(secret);

  const created = await prisma.apiKey.create({
    data: {
      userId,
      name,
      prefix,
      keyHash,
    },
    select: {
      id: true,
      name: true,
      prefix: true,
      createdAt: true,
    },
  });

  // Return the full secret only once.
  return NextResponse.json({ apiKey: created, secret });
}
