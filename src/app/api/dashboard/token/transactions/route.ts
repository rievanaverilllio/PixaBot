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

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const takeParam = Number.parseInt(url.searchParams.get("take") ?? "20", 10);
  const take = Number.isFinite(takeParam) ? Math.min(100, Math.max(1, takeParam)) : 20;

  const transactions = await prisma.tokenTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      type: true,
      amount: true,
      note: true,
      createdAt: true,
      metadata: true,
    },
  });

  return NextResponse.json({ transactions });
}
