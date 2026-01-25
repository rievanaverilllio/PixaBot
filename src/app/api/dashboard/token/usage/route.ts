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

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const daysParam = Number.parseInt(url.searchParams.get("days") ?? "7", 10);
  const days = Number.isFinite(daysParam) ? Math.min(90, Math.max(1, daysParam)) : 7;

  const now = new Date();
  const start = startOfDay(new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000));

  const events = await prisma.usageEvent.findMany({
    where: { userId, createdAt: { gte: start } },
    select: { tokens: true, createdAt: true },
  });

  const byDay = new Map<string, number>();
  for (const ev of events) {
    const d = startOfDay(ev.createdAt).toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + (ev.tokens ?? 0));
  }

  const series = Array.from({ length: days }).map((_, idx) => {
    const d = new Date(start.getTime() + idx * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    return { date: key, day: label, tokens: byDay.get(key) ?? 0 };
  });

  return NextResponse.json({ days, series });
}
