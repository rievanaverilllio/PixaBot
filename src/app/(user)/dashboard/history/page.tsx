"use client";

import Link from "next/link";
import { Download, FileText, Clock, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

type UsageEventDto = {
  id: number;
  kind: "chat" | "image" | "api";
  action: string | null;
  tokens: number;
  createdAt: string;
};

type InvoiceDto = {
  id: number;
  number: string;
  status: string;
  amountCents: number;
  currency: string;
  pdfUrl: string | null;
  issuedAt: string;
  createdAt?: string;
  paidAt: string | null;
};

type TopupDto = {
  id: number;
  amount: number; // token amount
  note: string | null;
  metadata?: any;
  createdAt: string;
};

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState("30d");

  const [isLoading, setIsLoading] = useState(true);
  const [usage, setUsage] = useState<UsageEventDto[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [topups, setTopups] = useState<TopupDto[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/dashboard/history?range=${encodeURIComponent(range)}`, { method: "GET" });
        const json = (await res.json().catch(() => null)) as
          | { usageEvents?: UsageEventDto[]; invoices?: InvoiceDto[]; error?: string }
          | null;
        if (!res.ok) throw new Error(json?.error || "Gagal memuat history");
        if (cancelled) return;
        setUsage(Array.isArray(json?.usageEvents) ? json!.usageEvents : []);
        setInvoices(Array.isArray(json?.invoices) ? json!.invoices : []);
        setTopups(Array.isArray((json as any)?.topups) ? (json as any).topups : []);
        setWalletBalance(typeof (json as any)?.walletBalance === "number" ? (json as any).walletBalance : 0);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat history");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const filtered = useMemo(() => {
    return usage.filter((u) => {
      const type = u.kind;
      const action = (u.action ?? type).toLowerCase();
      if (filter !== "all" && type !== filter) return false;
      if (query && !action.includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, filter]);

  // Combine usage events and topups when filter is 'all' so the table shows everything.
  const displayed = useMemo(() => {
    // Map topups to a unified shape compatible with usage rows
    const topupRows = topups.map((t) => ({
      id: -t.id, // ensure unique key and sortability; negative to avoid collision with usage ids
      kind: "topup" as const,
      action: t.note ?? "Top-up",
      tokens: t.amount,
      createdAt: t.createdAt,
    }));

    if (filter === "all") {
      // Merge and sort by createdAt desc
      const merged = [...topupRows, ...usage].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      // Apply query filter on action if present
      return merged.filter((r) => {
        if (!query) return true;
        return (r.action ?? r.kind).toLowerCase().includes(query.toLowerCase());
      });
    }

    return filtered;
  }, [filter, topups, usage, filtered, query]);

  const totals = useMemo(() => {
    const tokens = displayed.reduce((s, r) => s + (r.tokens ?? 0), 0);
    const calls = displayed.filter((d) => d.kind !== "topup").length;
    const invoiceTotal = invoices.reduce((s, i) => s + (i.amountCents ?? 0) / 100, 0);
    const topupTotal = topups.reduce((s, t) => s + (t.amount ?? 0), 0);
    return { tokens, calls, invoiceTotal, topupTotal, walletBalance };
  }, [displayed, invoices, topups, walletBalance]);

  function exportCsv() {
    const rows = [
      ["id", "action", "type", "tokens", "date"],
      ...filtered.map((r) => [String(r.id), r.action ?? "", r.kind, String(r.tokens), r.createdAt]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usage.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Riwayat & Tagihan</h1>
            <p className="text-sm text-muted-foreground">Lihat aktivitas penggunaan token, unduh invoice, dan ekspor data untuk akuntansi.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCsv}><FileText className="mr-2" />Export CSV</Button>
            <Link href="/dashboard/payments">
              <Button><Download className="mr-2" />Pembayaran</Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md border">
                    <div className="text-xs text-muted-foreground">Total Token (filter)</div>
                    <div className="text-2xl font-semibold">{totals.tokens}</div>
                  </div>
                  <div className="p-3 rounded-md border">
                    <div className="text-xs text-muted-foreground">Total Panggilan</div>
                    <div className="text-2xl font-semibold">{totals.calls}</div>
                  </div>
                  <div className="p-3 rounded-md border">
                    <div className="text-xs text-muted-foreground">Total Invoice</div>
                    <div className="text-2xl font-semibold">{formatCurrency(totals.invoiceTotal)}</div>
                  </div>
                  <div className="p-3 rounded-md border">
                    <div className="text-xs text-muted-foreground">Sisa Token</div>
                    <div className="text-2xl font-semibold">{totals.walletBalance}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Cari aktivitas" value={query} onChange={(e) => setQuery(e.target.value)} />
                <div className="flex gap-2">
                  <Select value={filter} onValueChange={(v) => setFilter(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Select value={range} onValueChange={(v) => setRange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="30d" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="outline">Download All Invoices</Button>
                <Button onClick={() => toast.success('Invoice request sent')}>Request Invoice</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Riwayat Penggunaan</CardTitle>
              <div className="text-sm text-muted-foreground">Log aktivitas berdasarkan filter</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Aktivitas</th>
                    <th className="pb-3">Tipe</th>
                    <th className="pb-3">Token</th>
                    <th className="pb-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td className="py-3 text-sm text-muted-foreground" colSpan={5}>Memuat...</td></tr>
                  ) : displayed.length === 0 ? (
                    <tr><td className="py-3 text-sm text-muted-foreground" colSpan={5}>Tidak ada data.</td></tr>
                  ) : displayed.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-muted/20">
                      <td className="py-3 text-sm">{new Date(u.createdAt).toLocaleString("id-ID")}</td>
                      <td className="py-3">{u.action ?? (u.kind === "image" ? "Image generation" : u.kind === "chat" ? "Chat" : u.kind === "topup" ? "Top-up" : "API")}</td>
                      <td className="py-3 text-sm text-muted-foreground">{u.kind}</td>
                      <td className="py-3 tabular-nums">{u.tokens}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Riwayat Top-up</CardTitle>
              <div className="text-sm text-muted-foreground">Riwayat top-up token</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {topups.length === 0 ? (
                <div className="text-sm text-muted-foreground">Belum ada top-up.</div>
              ) : (
                topups.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <div className="font-medium">Top-up {t.note ?? "(manual)"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString("id-ID")}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="tabular-nums">{t.amount}</div>
                      <div className="text-xs text-muted-foreground">tokens</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoice & Tagihan</CardTitle>
              <div className="text-sm text-muted-foreground">Download PDF invoice untuk akuntansi</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {invoices.length === 0 ? (
                <div className="text-sm text-muted-foreground">Belum ada invoice.</div>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <div className="font-medium">Invoice {inv.number}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(inv.issuedAt).toLocaleDateString("id-ID")} · {inv.status}
                        {inv.status === "pending" && inv.createdAt ? (
                          <span> · sisa {(() => {
                            const remainingMs = Math.max(0, 24 * 60 * 60 * 1000 - (Date.now() - new Date(inv.createdAt!).getTime()));
                            const s = Math.floor(remainingMs / 1000);
                            const h = Math.floor(s / 3600);
                            const m = Math.floor((s % 3600) / 60);
                            return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm' : s < 60 ? s + 's' : ''}`;
                          })()}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="tabular-nums">{formatCurrency((inv.amountCents ?? 0) / 100)}</div>
                      {inv.pdfUrl ? (
                        <Link href={inv.pdfUrl} target="_blank">
                          <Button variant="ghost" size="sm"><Download className="mr-2" />Download</Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
