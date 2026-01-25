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

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Remove any pending payments/invoices older than 1 day
  try {
    await cleanupOldPendingForUser(userId);
  } catch (e) {
    // non-fatal; log to console
    console.error("cleanupOldPendingForUser failed", e);
  }

  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      status: true,
      provider: true,
      amountCents: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      invoice: {
        select: {
          id: true,
          number: true,
          status: true,
          amountCents: true,
          currency: true,
          issuedAt: true,
          paidAt: true,
          pdfUrl: true,
        },
      },
    },
  });

  return NextResponse.json({ payments });
}
