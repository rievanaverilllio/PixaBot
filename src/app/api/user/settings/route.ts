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
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true, wallet: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const lastTopup = await prisma.tokenTransaction.findFirst({
    where: { userId, type: "topup" },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  return NextResponse.json({
    profile: {
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? null,
    },
    settings: {
      twoFaEnabled: user.settings?.twoFaEnabled ?? false,
      notificationsEnabled: user.settings?.notificationsEnabled ?? true,
      language: user.settings?.language ?? null,
      timezone: user.settings?.timezone ?? null,
    },
    billing: {
      tokenBalance: user.wallet?.balance ?? 0,
      lastTopupAt: lastTopup?.createdAt ?? null,
    },
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        twoFaEnabled?: boolean;
        notificationsEnabled?: boolean;
        language?: string | null;
        timezone?: string | null;
      }
    | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const email = typeof body.email === "string" ? body.email.trim() : undefined;
  const twoFaEnabled =
    typeof body.twoFaEnabled === "boolean" ? body.twoFaEnabled : undefined;
  const notificationsEnabled =
    typeof body.notificationsEnabled === "boolean" ? body.notificationsEnabled : undefined;
  const language =
    typeof body.language === "string"
      ? body.language.trim()
      : body.language ?? undefined;
  const timezone =
    typeof body.timezone === "string"
      ? body.timezone.trim()
      : body.timezone ?? undefined;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : null),
        ...(email !== undefined ? { email } : null),
      },
      select: { id: true },
    }),
    prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        twoFaEnabled: twoFaEnabled ?? false,
        notificationsEnabled: notificationsEnabled ?? true,
        language: language ?? null,
        timezone: timezone ?? null,
      },
      update: {
        ...(twoFaEnabled !== undefined ? { twoFaEnabled } : null),
        ...(notificationsEnabled !== undefined ? { notificationsEnabled } : null),
        ...(language !== undefined ? { language: language || null } : null),
        ...(timezone !== undefined ? { timezone: timezone || null } : null),
      },
      select: { userId: true },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
