import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

export async function POST(req: Request) {
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

  const mistral = await mistralReply(messages, {
    apiKey: overrideApiKey,
    url: overrideUrl,
    model: overrideModel,
  });

  // If client explicitly provided an API key/url/model and Mistral failed, surface an error
  if ((overrideApiKey || overrideUrl || overrideModel) && !mistral) {
    return NextResponse.json({ reply: "Gagal menghubungi Mistral. Periksa API key atau endpoint yang dimasukkan." }, { status: 502 });
  }

  if (mistral) return NextResponse.json({ reply: sanitizeReply(mistral) });

  // 2) Try OpenAI if configured (optional fallback)
  const openai = await openAiReply(messages);
  if (openai) return NextResponse.json({ reply: sanitizeReply(openai) });

  // 3) Fallback local reply (no external keys needed)
  return NextResponse.json({ reply: sanitizeReply(localReply(lastUser)) });
}
