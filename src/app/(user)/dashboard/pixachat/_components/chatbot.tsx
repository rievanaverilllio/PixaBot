"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Send, Trash2, Image as ImageIcon, Check, MoreHorizontal, Key } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  imageUrl?: string;
};

type ChatApiResponse = {
  reply: string;
  quota?: {
    kind: "chat" | "image";
    plan: string;
    used: number;
    limit: number | null;
    remaining: number | null;
    tokenBalance: number;
    tokenCost: number;
  };
};

type ChatApiError = {
  error?: string;
  code?: string;
  quota?: ChatApiResponse["quota"];
};

type ImageApiResponse = {
  image?: string;
  url?: string;
  error?: string;
  quota?: ChatApiResponse["quota"];
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizeInput(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

export function ChatBot() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: "assistant",
      content: "Halo! Tulis pesanmu di bawah—aku akan membalas secepatnya.",
      createdAt: Date.now(),
    },
  ]);

  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const [imageToolEnabled, setImageToolEnabled] = React.useState(false);
  const [customApiKey, setCustomApiKey] = React.useState<string>("");
  const [apiKeyModalOpen, setApiKeyModalOpen] = React.useState(false);
  const [apiKeyDraft, setApiKeyDraft] = React.useState("");

  const [quota, setQuota] = React.useState<ChatApiResponse["quota"] | null>(null);
  const [blocked, setBlocked] = React.useState<{ code: string; message: string } | null>(null);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  // Prevent the surrounding page from scrolling while the chat is active
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    try {
      const k = localStorage.getItem("pixabot.mistralApiKey");
      if (k) setCustomApiKey(k);
    } catch {
      // ignore
    }
  }, []);

  const handleOpenApiKeyModal = React.useCallback(() => {
    setApiKeyDraft(customApiKey ?? "");
    setApiKeyModalOpen(true);
  }, [customApiKey]);

  const handleSaveApiKey = React.useCallback(() => {
    try {
      const t = (apiKeyDraft ?? "").trim();
      if (!t) {
        localStorage.removeItem("pixabot.mistralApiKey");
        setCustomApiKey("");
      } else {
        localStorage.setItem("pixabot.mistralApiKey", t);
        setCustomApiKey(t);
      }
    } catch {
      // ignore
    } finally {
      setApiKeyModalOpen(false);
    }
  }, [apiKeyDraft]);

  const handleCancelApiKey = React.useCallback(() => {
    setApiKeyModalOpen(false);
  }, []);

  const handleClearApiKey = React.useCallback(() => {
    try {
      localStorage.removeItem("pixabot.mistralApiKey");
      setCustomApiKey("");
      setApiKeyDraft("");
    } catch {
      // ignore
    } finally {
      setApiKeyModalOpen(false);
    }
  }, []);

  const sendMessage = React.useCallback(async () => {
    const text = sanitizeInput(input);
    if (!text || isSending || blocked) return;

    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    setIsSending(true);
    setInput("");
    setMessages((prev) => [...prev, userMsg]);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customApiKey) headers["x-mistral-api-key"] = customApiKey;

      const res = await fetch("/api/pixachat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as ChatApiError | null;
        const message = json?.error || `Request failed: ${res.status}`;
        const code = json?.code || String(res.status);
        if (res.status === 401) {
          setBlocked({ code: "UNAUTHORIZED", message: "Sesi kamu habis. Silakan login ulang." });
        }
        if (res.status === 402) {
          setQuota(json?.quota ?? null);
          setBlocked({ code, message });
        }
        throw new Error(message);
      }

      const data = (await res.json()) as ChatApiResponse;
      if (data.quota) setQuota(data.quota);
      setBlocked(null);

      const assistantMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: data.reply ?? "Maaf, aku tidak punya jawaban untuk itu.",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Maaf, terjadi error saat mengirim pesan. Coba lagi ya.";
      const assistantMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: msg || "Maaf, terjadi error saat mengirim pesan. Coba lagi ya.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, messages, customApiKey, blocked]);

  const generateImage = React.useCallback(async () => {
    let prompt = sanitizeInput(input);
    if (!prompt) {
      // ask user for prompt if input empty
      // eslint-disable-next-line no-alert
      const p = window.prompt("Masukkan prompt gambar:");
      if (!p) return;
      prompt = p.trim();
    }

    setIsGeneratingImage(true);
    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: `[Image prompt] ${prompt}`,
      createdAt: Date.now(),
    };

    // insert user message and a loading assistant message placeholder
    const loadingId = createId();
    const loadingMsg: ChatMessage = {
      id: loadingId,
      role: "assistant",
      content: "Menghasilkan gambar...",
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customApiKey) headers["x-mistral-api-key"] = customApiKey;

      const res = await fetch("/api/pixachat/image", {
        method: "POST",
        cache: "no-store",
        headers,
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as ChatApiError | null;
        const message = json?.error || `Image API ${res.status}`;
        const code = json?.code || String(res.status);
        if (res.status === 401) {
          setBlocked({ code: "UNAUTHORIZED", message: "Sesi kamu habis. Silakan login ulang." });
        }
        if (res.status === 402) {
          setQuota(json?.quota ?? null);
          setBlocked({ code, message });
        }
        throw new Error(message);
      }

      const data = (await res.json().catch(() => null)) as ImageApiResponse | null;
      if (data?.quota) setQuota(data.quota);
      setBlocked(null);

      const finalMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: data?.error ? "Gagal membuat gambar." : "Berikut gambar yang dihasilkan.",
        createdAt: Date.now(),
        imageUrl: data?.image ?? data?.url ?? undefined,
      };

      setMessages((prev) => prev.map((m) => (m.id === loadingId ? finalMsg : m)));
    } catch (_err) {
      const errMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "Maaf, gagal membuat gambar.",
        createdAt: Date.now(),
      };
      setMessages((prev) => prev.map((m) => (m.id === loadingId ? errMsg : m)));
    } finally {
      setIsGeneratingImage(false);
      // reset input and disable image tool so subsequent Enter sends chat
      setInput("");
      setImageToolEnabled(false);
    }
  }, [input, customApiKey]);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (imageToolEnabled) {
          void generateImage();
        } else {
          void sendMessage();
        }
      }
    },
    [sendMessage, generateImage, imageToolEnabled]
  );

  const clearChat = React.useCallback(() => {
    setBlocked(null);
    setMessages([
      {
        id: createId(),
        role: "assistant",
        content: "Chat dibersihkan. Ada yang bisa kubantu?",
        createdAt: Date.now(),
      },
    ]);
  }, []);

  return (
    <Card className="relative @container/card min-h-[min(80vh,900px)] border-0">
      <div className="absolute top-3 right-3 flex items-center gap-2 z-50 pointer-events-auto">
        <Button type="button" variant="outline" size="icon" onClick={handleOpenApiKeyModal} aria-label="Set API key">
          <Key className="size-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={clearChat} aria-label="Clear chat">
          <Trash2 className="size-4" />
        </Button>
      </div>
      <Dialog open={apiKeyModalOpen} onOpenChange={setApiKeyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan Mistral API Key</DialogTitle>
            <DialogDescription>Masukkan API key Mistral Anda. Kosongkan untuk menghapus.</DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <Input
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              placeholder="MISTRAL_API_KEY"
            />
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleCancelApiKey}>Batal</Button>
              <Button onClick={handleSaveApiKey}>Simpan</Button>
              <Button variant="outline" onClick={handleClearApiKey}>Hapus</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardContent className="flex h-full flex-col gap-4">
        {blocked ? (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <div className="font-medium">Akses chat dibatasi</div>
            <div className="text-muted-foreground mt-1">{blocked.message}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link href="/dashboard/buy-token">
                <Button size="sm">Beli Paket / Top Up</Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => setBlocked(null)}>
                Coba lagi
              </Button>
              {quota && quota.limit !== null ? (
                <div className="text-xs text-muted-foreground ml-auto">
                  {quota.kind === "image" ? "Image" : "Chat"} quota: {quota.used}/{quota.limit}
                </div>
              ) : quota ? (
                <div className="text-xs text-muted-foreground ml-auto">
                  Token: {quota.tokenBalance.toLocaleString("id-ID")}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <ScrollArea className="h-[min(68vh,800px)] rounded-md border-0 overscroll-contain">
          <div className="flex flex-col gap-3 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <div className="whitespace-pre-wrap wrap-break-word">{m.content}</div>
                {m.imageUrl ? (
                  <div className="mt-2 inline-block">
                    <a href={m.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                      <img
                        src={m.imageUrl}
                        alt="generated"
                        className="block max-w-[360px] max-h-[360px] w-auto h-auto rounded-md shadow-sm object-contain"
                      />
                    </a>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <a href={m.imageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        Buka gambar di tab baru
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            {isSending ? (
              <div className="max-w-[85%] rounded-xl bg-muted px-3 py-2 text-foreground text-sm">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Mengetik…
                </span>
              </div>
            ) : null}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Tulis pesan… (Enter untuk kirim, Shift+Enter untuk baris baru)"
              className="h-4 pr-12"
              disabled={isSending || Boolean(blocked)}
            />

            <div className="absolute right-2 top-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Tools">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setImageToolEnabled((v) => !v);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="size-4" />
                        <span>Generate image</span>
                      </div>
                      {imageToolEnabled ? <Check className="size-4" /> : null}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={async () => {
                if (imageToolEnabled) {
                  await generateImage();
                } else {
                  await sendMessage();
                }
              }}
              disabled={isSending || isGeneratingImage || !sanitizeInput(input) || Boolean(blocked)}
            >
              {isGeneratingImage ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
              Kirim
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
