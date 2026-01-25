import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const FREE_CHAT_LIMIT = 3;
const PAID_CHAT_TOKEN_COST = 10;

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
  return 0; // user/free
}

type InboundMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type RequestBody = {
  messages?: InboundMessage[];
};

function sanitizeReply(text?: string) {
  if (!text) return "";
  // remove all asterisks and collapse multiple spaces/newlines
  return text.replace(/\*/g, "").replace(/\s{2,}/g, " ").trim();
}

function localReply(lastUserMessage: string): string {
  const text = lastUserMessage.trim();
  const lower = text.toLowerCase();

  if (!text) return "Tulis pesan dulu ya.";

  if (["hi", "halo", "hai", "hey"].some((k) => lower === k || lower.startsWith(`${k} `))) {
    return "Halo! Ada yang bisa aku bantu?";
  }

  if (lower.includes("bantuan") || lower.includes("help")) {
    return "Coba jelaskan kebutuhanmu (mis. 'buatkan ringkasan', 'buat email', 'jelaskan error Next.js'), nanti aku bantu step-by-step.";
  }

  if (lower.includes("error") || lower.includes("bug")) {
    return "Bisa tempel pesan error + file/stacktrace-nya? Aku bantu analisis.";
  }

  return `Aku menangkap pesannya: “${text}”. Kalau mau, jelaskan konteksnya biar aku bisa jawab lebih tepat.`;
}

async function openAiReply(messages: InboundMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}

async function mistralReply(messages: InboundMessage[], override?: { apiKey?: string; url?: string; model?: string }) {
  const apiKey = override?.apiKey ?? process.env.MISTRAL_API_KEY;
  // Default to Mistral public endpoint if not configured in env or override
  const url = override?.url ?? process.env.MISTRAL_API_URL ?? "https://api.mistral.ai/v1/chat/completions";
  if (!apiKey || !url) return null;

  // Mistral's chat completions expects a model; provide a sensible default.
  const model = override?.model ?? process.env.MISTRAL_MODEL ?? "mistral-large-latest";

  const hasSystem = messages.some((m) => m.role === "system");
  const system: InboundMessage = {
    role: "system",
    content:
      "Kamu adalah asisten yang menjawab dengan rapi, ringkas, dan mudah dibaca dalam Bahasa Indonesia. " +
      "Hindari emoji, hiasan berlebihan, dan garis pemisah panjang. " +
      "PENTING: Jangan gunakan tabel Markdown (baris dengan | dan ---). " +
      "Jika perlu perbandingan, gunakan poin berlabel (mis. 'Gaming:', 'Harga:', dst) atau daftar bernomor. " +
      "Jawab langsung inti pertanyaan, maksimal 8-12 bullet kecuali diminta detail. "+
      "Jika memberi rekomendasi, akhiri dengan 1-2 pertanyaan klarifikasi yang paling penting.",
  };

  const outboundMessages = hasSystem ? messages : [system, ...messages];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: outboundMessages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.4,
      max_tokens: 700,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
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

async function getChatQuota(userId: number): Promise<QuotaInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, wallet: { select: { balance: true } } },
  });

  const role = user?.role ?? "user";
  const tokenBalance = user?.wallet?.balance ?? 0;

  const used = await prisma.usageEvent.count({
    where: { userId, kind: "chat" },
  });

  if (isAdminRole(role)) {
    return {
      kind: "chat",
      plan: role,
      used,
      limit: null,
      remaining: null,
      tokenBalance,
      tokenCost: 0,
    };
  }

  // Free plan: limited to 5 chats total.
  if (planRank(role) <= 0) {
    const remaining = Math.max(0, FREE_CHAT_LIMIT - used);
    return {
      kind: "chat",
      plan: "free",
      used,
      limit: FREE_CHAT_LIMIT,
      remaining,
      tokenBalance,
      tokenCost: 0,
    };
  }

  // Paid plans: limited by tokens
  return {
    kind: "chat",
    plan: role,
    used,
    limit: null,
    remaining: null,
    tokenBalance,
    tokenCost: PAID_CHAT_TOKEN_COST,
  };
}

async function recordChatUsage(params: { userId: number; tokenCost: number; note?: string }) {
  const { userId, tokenCost, note } = params;
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
          note: note ?? "PixaChat usage",
          metadata: { kind: "chat" },
          createdAt: now,
        },
      });
    }

    await tx.usageEvent.create({
      data: {
        userId,
        kind: "chat",
        action: "message",
        tokens: tokenCost,
        createdAt: now,
        metadata: tokenCost > 0 ? { tokenCost } : undefined,
      },
    });
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as RequestBody;
  const messages = Array.isArray(body.messages) ? body.messages : [];

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Check for runtime overrides provided by the client (headers or body)
  const headerApiKey = (req.headers && (req.headers as any).get ? (req.headers as any).get("x-mistral-api-key") : null) || undefined;
  const headerApiUrl = (req.headers && (req.headers as any).get ? (req.headers as any).get("x-mistral-api-url") : null) || undefined;
  const headerModel = (req.headers && (req.headers as any).get ? (req.headers as any).get("x-mistral-model") : null) || undefined;

  const overrideApiKey = headerApiKey ?? (body as any).apiKey ?? undefined;
  const overrideUrl = headerApiUrl ?? (body as any).mistralUrl ?? undefined;
  const overrideModel = headerModel ?? (body as any).mistralModel ?? undefined;

  const quota = await getChatQuota(userId);
  if (quota.limit !== null && quota.remaining !== null && quota.remaining <= 0) {
    return NextResponse.json(
      {
        error: "Batas chat paket free sudah habis. Silakan beli paket untuk lanjut.",
        code: "CHAT_LIMIT_REACHED",
        quota,
      },
      { status: 402 }
    );
  }

  // For paid plans, require tokens.
  if (quota.tokenCost > 0 && quota.tokenBalance < quota.tokenCost) {
    return NextResponse.json(
      {
        error: "Token tidak cukup. Silakan top up untuk lanjut.",
        code: "INSUFFICIENT_TOKENS",
        quota,
      },
      { status: 402 }
    );
  }

  const mistral = await mistralReply(messages, {
    apiKey: overrideApiKey,
    url: overrideUrl,
    model: overrideModel,
  });

  // If client explicitly provided an API key/url/model and Mistral failed, surface an error
  if ((overrideApiKey || overrideUrl || overrideModel) && !mistral) {
    return NextResponse.json({ reply: "Gagal menghubungi Mistral. Periksa API key atau endpoint yang dimasukkan." }, { status: 502 });
  }

  if (mistral) {
    try {
      await recordChatUsage({ userId, tokenCost: quota.tokenCost, note: "PixaChat message" });
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_TOKENS") {
        const refreshed = await getChatQuota(userId);
        return NextResponse.json(
          { error: "Token tidak cukup. Silakan top up untuk lanjut.", code: "INSUFFICIENT_TOKENS", quota: refreshed },
          { status: 402 }
        );
      }
      throw e;
    }
    const refreshed = await getChatQuota(userId);
    return NextResponse.json({ reply: sanitizeReply(mistral), quota: refreshed });
  }

  // 2) Try OpenAI if configured (optional fallback)
  const openai = await openAiReply(messages);
  if (openai) {
    try {
      await recordChatUsage({ userId, tokenCost: quota.tokenCost, note: "PixaChat message" });
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_TOKENS") {
        const refreshed = await getChatQuota(userId);
        return NextResponse.json(
          { error: "Token tidak cukup. Silakan top up untuk lanjut.", code: "INSUFFICIENT_TOKENS", quota: refreshed },
          { status: 402 }
        );
      }
      throw e;
    }
    const refreshed = await getChatQuota(userId);
    return NextResponse.json({ reply: sanitizeReply(openai), quota: refreshed });
  }

  // 3) Fallback local reply (no external keys needed)
  try {
    await recordChatUsage({ userId, tokenCost: quota.tokenCost, note: "PixaChat message" });
  } catch (e) {
    if (e instanceof Error && e.message === "INSUFFICIENT_TOKENS") {
      const refreshed = await getChatQuota(userId);
      return NextResponse.json(
        { error: "Token tidak cukup. Silakan top up untuk lanjut.", code: "INSUFFICIENT_TOKENS", quota: refreshed },
        { status: 402 }
      );
    }
    throw e;
  }
  const refreshed = await getChatQuota(userId);
  return NextResponse.json({ reply: sanitizeReply(localReply(lastUser)), quota: refreshed });
}
