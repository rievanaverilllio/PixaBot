"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreditCard, BadgeCheck, Download, Plus, Trash2 } from "lucide-react";

const payments = [
  { id: 1, method: "Visa **** 2301", status: "Primary", last4: "2301" },
  { id: 2, method: "PayPal - user@domain.com", status: "Verified", last4: null },
];

const history = [
  { id: 1, date: "2026-01-11", amount: 25, note: "Top-up Pro Pack", invoice: "/invoices/invoice-101.pdf" },
  { id: 2, date: "2025-12-30", amount: 5, note: "Starter Pack", invoice: "/invoices/invoice-100.pdf" },
];

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function PaymentsPage() {
  const [methods, setMethods] = useState(payments);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  function addCard() {
    if (!cardNumber || cardNumber.length < 12) {
      toast.error("Masukkan nomor kartu yang valid");
      return;
    }
    const last4 = cardNumber.slice(-4);
    const id = Date.now();
    setMethods((s) => [{ id, method: `${cardName || 'Card'} **** ${last4}`, status: "Pending", last4 }, ...s]);
    setCardName("");
    setCardNumber("");
    toast.success("Metode pembayaran ditambahkan (mock)");
  }

  function removeMethod(id: number) {
    setMethods((s) => s.filter((m) => m.id !== id));
    toast.success("Metode pembayaran dihapus");
  }

  const totalSpent = history.reduce((s, h) => s + h.amount, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pembayaran & Metode</h1>
            <p className="text-sm text-muted-foreground">Kelola metode pembayaran, lihat riwayat top-up, dan unduh invoice untuk akuntansi.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/buy-token">
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
                {methods.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{m.method}</div>
                      <div className="text-xs text-muted-foreground">{m.status}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toast.success('Set as primary (mock)')}><BadgeCheck /></Button>
                      <Button variant="outline" size="sm" onClick={() => removeMethod(m.id as number)}><Trash2 /></Button>
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
                  <Link href="/history">
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
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <div className="font-medium">{h.note}</div>
                    <div className="text-xs text-muted-foreground">{h.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="tabular-nums">{formatCurrency(h.amount)}</div>
                    <Link href={h.invoice} target="_blank">
                      <Button variant="ghost" size="sm"><Download className="mr-2"/>Invoice</Button>
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
