import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const FREE_IMAGE_LIMIT = 1;
const PAID_IMAGE_TOKEN_COST = 40;

function getUserIdFromSession(session: unknown): number | null {
  const s = session as { user?: { id?: string } } | null;
  const id = s?.user?.id;
  if (!id) return null;
  const n = Number.parseInt(String(id), 10);
  return Number.isFinite(n) ? n : null;
}

function isAdminRole(role?: string | null) {
  return (role ?? "").toLowerCase() === "admin";
}

function planRank(role?: string | null) {
  const r = (role ?? "user").toLowerCase();
  if (r === "admin") return 999;
  if (r === "business") return 30;
  if (r === "pro") return 20;
  if (r === "starter") return 10;
  return 0;
}

type QuotaInfo = {
  kind: "chat" | "image";
  plan: string;
  used: number;
  limit: number | null;
  remaining: number | null;
  tokenBalance: number;
  tokenCost: number;
};

async function getImageQuota(userId: number): Promise<QuotaInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, wallet: { select: { balance: true } } },
  });

  const role = user?.role ?? "user";
  const tokenBalance = user?.wallet?.balance ?? 0;

  const used = await prisma.usageEvent.count({
    where: { userId, kind: "image" },
  });

  if (isAdminRole(role)) {
    return { kind: "image", plan: role, used, limit: null, remaining: null, tokenBalance, tokenCost: 0 };
  }

  if (planRank(role) <= 0) {
    const remaining = Math.max(0, FREE_IMAGE_LIMIT - used);
    return { kind: "image", plan: "free", used, limit: FREE_IMAGE_LIMIT, remaining, tokenBalance, tokenCost: 0 };
  }

  return { kind: "image", plan: role, used, limit: null, remaining: null, tokenBalance, tokenCost: PAID_IMAGE_TOKEN_COST };
}

async function recordImageUsage(params: { userId: number; tokenCost: number; note?: string; metadata?: Prisma.InputJsonObject }) {
  const { userId, tokenCost, note, metadata } = params;
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    if (tokenCost > 0) {
      await tx.tokenWallet.upsert({
        where: { userId },
        create: { userId, balance: 0 },
        update: {},
      });

      const updated = await tx.tokenWallet.updateMany({
        where: { userId, balance: { gte: tokenCost } },
        data: { balance: { decrement: tokenCost } },
      });

      if (updated.count !== 1) {
        throw new Error("INSUFFICIENT_TOKENS");
      }

      await tx.tokenTransaction.create({
        data: {
          userId,
          type: "usage",
          amount: -tokenCost,
          note: note ?? "Image generation usage",
          metadata: { kind: "image", ...(metadata ?? {}) },
          createdAt: now,
        },
      });
    }

    await tx.usageEvent.create({
      data: {
        userId,
        kind: "image",
        action: "generate",
        tokens: tokenCost,
        createdAt: now,
        metadata: metadata ?? undefined,
      },
    });
  });
}

type Body = { prompt?: string };

function buildUrl(endpoint: string, prompt = "") {
  if (!endpoint) return null;
  if (endpoint.includes("YOUR_PROMPT_HERE")) {
    return endpoint.replace("YOUR_PROMPT_HERE", encodeURIComponent(prompt));
  }
  if (endpoint.includes("{prompt}")) {
    return endpoint.replace("{prompt}", encodeURIComponent(prompt));
  }
  // Support endpoints that embed the prompt as a path segment, e.g. https://.../prompt/YOUR_PROMPT_HERE
  const promptKey = "/prompt/";
  const idx = endpoint.indexOf(promptKey);
  if (idx !== -1) {
    // replace the segment after /prompt/ up to query string or end
    const before = endpoint.slice(0, idx + promptKey.length);
    const rest = endpoint.slice(idx + promptKey.length);
    const qIdx = rest.indexOf("?");
    const after = qIdx === -1 ? "" : rest.slice(qIdx);
    return `${before}${encodeURIComponent(prompt)}${after}`;
  }
  // fallback: append as ?prompt=
  const sep = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${sep}prompt=${encodeURIComponent(prompt)}`;
}

function appendCacheBust(url: string) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}__cb=${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

async function fetchImageAsDataUrl(url: string) {
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) return null;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.startsWith("image/")) {
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  }

  // if JSON, try to extract image url
  if (contentType.includes("application/json")) {
    const json = await res.json().catch(() => null);
    if (!json) return null;
    // try common fields
      if (typeof json === "object" && json !== null) {
        const js = json as Record<string, unknown>;
        const urlCandidates = ["url", "image", "image_url", "data"];
        for (const k of urlCandidates) {
          const v = js[k];
          if (typeof v === "string") return v;
          if (Array.isArray(v) && v.length > 0) {
            const first = v[0];
            if (typeof first === "object" && first !== null && "url" in (first as Record<string, unknown>)) {
              const urlVal = (first as Record<string, unknown>).url;
              if (typeof urlVal === "string") return urlVal;
            }
          }
        }
      }
  }

  // unknown response
  return null;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const prompt = (body.prompt ?? "").toString();
  const headerEndpoint = (req.headers && (req.headers as any).get ? (req.headers as any).get("x-image-endpoint") : null) ?? undefined;
  const endpoint = headerEndpoint ?? (body as any).endpoint ?? process.env.ENDPOINT_GENERETE_IMAGE ?? "https://image.pollinations.ai/prompt/YOUR_PROMPT_HERE";

  const url = buildUrl(endpoint, prompt);
  if (!url) return NextResponse.json({ error: "Invalid endpoint." }, { status: 500 });

  const fetchUrl = appendCacheBust(url);

  const quota = await getImageQuota(userId);
  if (quota.limit !== null && quota.remaining !== null && quota.remaining <= 0) {
    return NextResponse.json(
      {
        error: "Batas generate image paket free sudah habis. Silakan beli paket untuk lanjut.",
        code: "IMAGE_LIMIT_REACHED",
        quota,
      },
      { status: 402 }
    );
  }

  if (quota.tokenCost > 0 && quota.tokenBalance < quota.tokenCost) {
    return NextResponse.json(
      {
        error: "Token tidak cukup untuk generate image. Silakan top up untuk lanjut.",
        code: "INSUFFICIENT_TOKENS",
        quota,
      },
      { status: 402 }
    );
  }

  try {
    const imageOrUrl = await fetchImageAsDataUrl(fetchUrl);
    if (!imageOrUrl) {
      return NextResponse.json(
        { error: "Unable to fetch image from endpoint." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    try {
      await recordImageUsage({
        userId,
        tokenCost: quota.tokenCost,
        note: "Image generation",
        metadata: { promptLength: prompt.length },
      });
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_TOKENS") {
        const refreshed = await getImageQuota(userId);
        return NextResponse.json(
          { error: "Token tidak cukup untuk generate image. Silakan top up untuk lanjut.", code: "INSUFFICIENT_TOKENS", quota: refreshed },
          { status: 402 }
        );
      }
      throw e;
    }

    const refreshed = await getImageQuota(userId);

    // If imageOrUrl is a data URL (starts with data:), return as `image`
    if (typeof imageOrUrl === "string" && imageOrUrl.startsWith("data:")) {
      return NextResponse.json(
        { image: imageOrUrl, quota: refreshed },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    // otherwise return as url
    return NextResponse.json(
      { url: appendCacheBust(String(imageOrUrl)), quota: refreshed },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
