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

async function mistralReply(messages: InboundMessage[]) {
  const apiKey = process.env.MISTRAL_API_KEY;
  const url = process.env.MISTRAL_API_URL;
  if (!apiKey || !url) return null;

  // Mistral's chat completions expects a model; provide a sensible default.
  const model = process.env.MISTRAL_MODEL;

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

  // 1) Try Mistral if configured
  const mistral = await mistralReply(messages);
  if (mistral) return NextResponse.json({ reply: sanitizeReply(mistral) });

  // 2) Try OpenAI if configured (optional fallback)
  const openai = await openAiReply(messages);
  if (openai) return NextResponse.json({ reply: sanitizeReply(openai) });

  // 3) Fallback local reply (no external keys needed)
  return NextResponse.json({ reply: sanitizeReply(localReply(lastUser)) });
}
