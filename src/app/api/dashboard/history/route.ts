import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { cleanupOldPendingForUser } from "@/lib/billing-cleanup";

export const runtime = "nodejs";

function getUserIdFromSession(session: unknown): number | null {
  const s = session as { user?: { id?: string } } | null;
  const id = s?.user?.id;
  if (!id) return null;
  const n = Number.parseInt(String(id), 10);
  return Number.isFinite(n) ? n : null;
}

function parseRangeToDays(range: string | null): number {
  const r = (range ?? "30d").toLowerCase();
  if (r === "7d") return 7;
  if (r === "90d") return 90;
  return 30;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Remove pending payments/invoices older than 1 day so history doesn't show stale pending items
  try {
    await cleanupOldPendingForUser(userId);
  } catch (e) {
    console.error("cleanupOldPendingForUser failed", e);
  }

  const url = new URL(req.url);
  const days = parseRangeToDays(url.searchParams.get("range"));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [usageEvents, invoices] = await Promise.all([
    prisma.usageEvent.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        kind: true,
        action: true,
        tokens: true,
        createdAt: true,
        metadata: true,
      },
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        number: true,
        status: true,
        amountCents: true,
        currency: true,
        pdfUrl: true,
        issuedAt: true,
        paidAt: true,
      },
    }),
  ]);

  return NextResponse.json({ usageEvents, invoices, rangeDays: days });
}
