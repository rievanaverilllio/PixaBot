"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreditCard, BadgeCheck, Download, Plus, Trash2 } from "lucide-react";

type PaymentMethodDto = {
  id: number;
  label: string;
  type: string;
  last4: string | null;
  isPrimary: boolean;
  provider: string | null;
  status: string | null;
  createdAt: string;
};

type PaymentDto = {
  id: number;
  status: string;
  provider: string | null;
  amountCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  invoice: null | {
    id: number;
    number: string;
    status: string;
    amountCents: number;
    currency: string;
    issuedAt: string;
    paidAt: string | null;
    pdfUrl: string | null;
  };
};

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function PaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethodDto[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const [mRes, pRes] = await Promise.all([
          fetch("/api/billing/methods", { method: "GET" }),
          fetch("/api/billing/payments", { method: "GET" }),
        ]);

        const mJson = (await mRes.json().catch(() => null)) as { methods?: PaymentMethodDto[]; error?: string } | null;
        const pJson = (await pRes.json().catch(() => null)) as { payments?: PaymentDto[]; error?: string } | null;

        if (!mRes.ok) throw new Error(mJson?.error || "Gagal memuat metode pembayaran");
        if (!pRes.ok) throw new Error(pJson?.error || "Gagal memuat riwayat pembayaran");

        if (cancelled) return;
        setMethods(Array.isArray(mJson?.methods) ? mJson!.methods : []);
        setPaymentHistory(Array.isArray(pJson?.payments) ? pJson!.payments : []);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat data pembayaran");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addCard() {
    if (!cardNumber || cardNumber.length < 12) {
      toast.error("Masukkan nomor kartu yang valid");
      return;
    }
    const last4 = cardNumber.slice(-4);

    try {
      const res = await fetch("/api/billing/methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: `${cardName || "Card"} **** ${last4}`,
          type: "card",
          last4,
          provider: "card",
        }),
      });
      const json = (await res.json().catch(() => null)) as { method?: PaymentMethodDto; error?: string } | null;
      if (!res.ok) throw new Error(json?.error || "Gagal menambahkan metode");
      if (json?.method) setMethods((s) => [json.method!, ...s]);
      setCardName("");
      setCardNumber("");
      toast.success("Metode pembayaran ditambahkan");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menambahkan metode");
    }
  }

  async function removeMethod(id: number) {
    try {
      const res = await fetch(`/api/billing/methods/${id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Gagal menghapus metode");
      setMethods((s) => s.filter((m) => m.id !== id));
      toast.success("Metode pembayaran dihapus");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus metode");
    }
  }

  async function setPrimary(id: number) {
    try {
      const res = await fetch(`/api/billing/methods/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setPrimary: true }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Gagal set primary");
      setMethods((s) => s.map((m) => ({ ...m, isPrimary: m.id === id })));
      toast.success("Primary method diperbarui");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal set primary");
    }
  }

  const totalSpent = useMemo(() => {
    return paymentHistory.reduce((s, p) => s + (p.amountCents ?? 0) / 100, 0);
  }, [paymentHistory]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pembayaran & Metode</h1>
            <p className="text-sm text-muted-foreground">Kelola metode pembayaran, lihat riwayat top-up, dan unduh invoice untuk akuntansi.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/buy-token">
              <Button><Plus className="mr-2"/>Beli Token</Button>
            </Link>
            <Button variant="outline">Billing Settings</Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Memuat...</div>
                ) : methods.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Belum ada metode pembayaran.</div>
                ) : methods.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {m.isPrimary ? "Primary" : ""}{m.isPrimary && m.status ? " · " : ""}{m.status ?? ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setPrimary(m.id)} aria-label="Set as primary"><BadgeCheck /></Button>
                      <Button variant="outline" size="sm" onClick={() => removeMethod(m.id)} aria-label="Remove"><Trash2 /></Button>
                    </div>
                  </div>
                ))}

                <div className="mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><Plus className="mr-2" />Tambah Metode Pembayaran</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah Metode Pembayaran</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 space-y-3">
                        <Input placeholder="Nama pada kartu" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                        <Input placeholder="Nomor kartu" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => { setCardName(''); setCardNumber(''); }}>Batal</Button>
                          <Button onClick={addCard}>Tambahkan</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Tagihan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Total yang dibelanjakan</div>
                <div className="text-2xl font-semibold">{formatCurrency(totalSpent)}</div>
                <div className="flex gap-2">
                  <Button variant="outline">Download Statement</Button>
                  <Link href="/dashboard/history">
                    <Button>Riwayat Lengkap</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions removed per user request */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Top-up & Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {paymentHistory.length === 0 ? (
                <div className="text-sm text-muted-foreground">Belum ada transaksi.</div>
              ) : (
                paymentHistory.map((p) => {
                  const amount = (p.amountCents ?? 0) / 100;
                  const note = p.invoice?.number ? `Invoice ${p.invoice.number}` : "Payment";
                  const when = new Date(p.createdAt).toLocaleDateString("id-ID");
                  const remainingMs = Math.max(0, 24 * 60 * 60 * 1000 - (Date.now() - new Date(p.createdAt).getTime()));
                  function formatRemaining(ms: number) {
                    if (ms <= 0) return "Expired";
                    const s = Math.floor(ms / 1000);
                    const h = Math.floor(s / 3600);
                    const m = Math.floor((s % 3600) / 60);
                    const parts = [];
                    if (h) parts.push(`${h}h`);
                    if (m) parts.push(`${m}m`);
                    if (!h && !m) parts.push(`${s}s`);
                    return parts.join(" ");
                  }
                  const invoiceUrl = p.invoice?.pdfUrl;
                  return (
                    <div key={p.id} className="flex items-center justify-between rounded-md border p-4">
                      <div>
                        <div className="font-medium">{note}</div>
                        <div className="text-xs text-muted-foreground">{when} · {p.status}{p.status === 'pending' ? ` · sisa ${formatRemaining(remainingMs)}` : ''}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="tabular-nums">{formatCurrency(amount)}</div>
                        {invoiceUrl ? (
                          <Link href={invoiceUrl} target="_blank">
                            <Button variant="ghost" size="sm"><Download className="mr-2"/>Invoice</Button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
