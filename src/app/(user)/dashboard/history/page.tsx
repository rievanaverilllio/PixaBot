"use client";

import Link from "next/link";
import { Download, FileText, Clock, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const usage = [
  { id: 1, action: "Chat: Teks -> Balasan", type: "chat", tokens: 12, date: "2026-01-11 09:12" },
  { id: 2, action: "Image generation", type: "image", tokens: 40, date: "2026-01-11 08:43" },
  { id: 3, action: "API call: /v1/ask", type: "api", tokens: 5, date: "2026-01-10 18:20" },
];

const invoices = [
  { id: 101, date: "2026-01-11", amount: 25, url: "/invoices/invoice-101.pdf" },
  { id: 100, date: "2025-12-30", amount: 5, url: "/invoices/invoice-100.pdf" },
];

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState("30d");

  const filtered = useMemo(() => {
    return usage.filter((u) => {
      if (filter !== "all" && u.type !== filter) return false;
      if (query && !u.action.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, filter]);

  const totals = useMemo(() => {
    const tokens = filtered.reduce((s, r) => s + r.tokens, 0);
    const calls = filtered.length;
    const invoiceTotal = invoices.reduce((s, i) => s + i.amount, 0);
    return { tokens, calls, invoiceTotal };
  }, [filtered]);

  function exportCsv() {
    const rows = [
      ["id", "action", "type", "tokens", "date"],
      ...filtered.map((r) => [String(r.id), r.action, r.type, String(r.tokens), r.date]),
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
            <Link href="/payments">
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Token (filter)</div>
                    <div className="text-2xl font-semibold">{totals.tokens}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Panggilan</div>
                    <div className="text-2xl font-semibold">{totals.calls}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Invoice</div>
                    <div className="text-2xl font-semibold">{formatCurrency(totals.invoiceTotal)}</div>
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
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-muted/20">
                      <td className="py-3 text-sm">{u.date}</td>
                      <td className="py-3">{u.action}</td>
                      <td className="py-3 text-sm text-muted-foreground">{u.type}</td>
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
              <CardTitle>Invoice & Tagihan</CardTitle>
              <div className="text-sm text-muted-foreground">Download PDF invoice untuk akuntansi</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <div className="font-medium">Invoice #{inv.id}</div>
                    <div className="text-xs text-muted-foreground">{inv.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="tabular-nums">{formatCurrency(inv.amount)}</div>
                    <Link href={inv.url} target="_blank">
                      <Button variant="ghost" size="sm"><Download className="mr-2" />Download</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
