import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = { prompt?: string };

function buildUrl(endpoint: string, prompt = "") {
  if (!endpoint) return null;
  if (endpoint.includes("YOUR_PROMPT_HERE")) {
    return endpoint.replace("YOUR_PROMPT_HERE", encodeURIComponent(prompt));
  }
  if (endpoint.includes("{prompt}")) {
    return endpoint.replace("{prompt}", encodeURIComponent(prompt));
  }
  // fallback: append as ?prompt=
  const sep = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${sep}prompt=${encodeURIComponent(prompt)}`;
}

async function fetchImageAsDataUrl(url: string) {
  const res = await fetch(url, { method: "GET" });
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
  const body = (await req.json().catch(() => ({}))) as Body;
  const prompt = (body.prompt ?? "").toString();

  const endpoint = process.env.ENDPOINT_GENERETE_IMAGE;
  if (!endpoint) {
    return NextResponse.json({ error: "Image endpoint not configured." }, { status: 500 });
  }

  const url = buildUrl(endpoint, prompt);
  if (!url) return NextResponse.json({ error: "Invalid endpoint." }, { status: 500 });

  try {
    const imageOrUrl = await fetchImageAsDataUrl(url);
    if (!imageOrUrl) {
      return NextResponse.json({ error: "Unable to fetch image from endpoint." }, { status: 502 });
    }

    // If imageOrUrl is a data URL (starts with data:), return as `image`
    if (typeof imageOrUrl === "string" && imageOrUrl.startsWith("data:")) {
      return NextResponse.json({ image: imageOrUrl });
    }

    // otherwise return as url
    return NextResponse.json({ url: imageOrUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
