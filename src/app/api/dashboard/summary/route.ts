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

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [wallet, todayEvents, totalEvents] = await Promise.all([
    prisma.tokenWallet.findUnique({ where: { userId }, select: { balance: true, updatedAt: true } }),
    prisma.usageEvent.findMany({
      where: { userId, createdAt: { gte: startOfDay } },
      select: { tokens: true },
    }),
    prisma.usageEvent.count({ where: { userId } }),
  ]);

  const todayUsage = todayEvents.reduce((s, e) => s + (e.tokens ?? 0), 0);

  return NextResponse.json({
    wallet: { balance: wallet?.balance ?? 0, updatedAt: wallet?.updatedAt ?? null },
    todayUsage,
    totalEvents,
  });
}
