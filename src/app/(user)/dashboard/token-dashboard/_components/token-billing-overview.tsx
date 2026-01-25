"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PaymentDto = {
  id: number;
  status: string;
  amountCents: number;
  currency: string;
  createdAt: string;
  invoice: null | {
    number: string;
    status: string;
    pdfUrl: string | null;
  };
};

function formatCurrencyUsd(amountCents: number) {
  const n = (amountCents ?? 0) / 100;
  return `$${n.toFixed(2)}`;
}

export function TokenBillingOverview() {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/billing/payments", { method: "GET" });
        const json = (await res.json().catch(() => null)) as { payments?: PaymentDto[]; error?: string } | null;
        if (!res.ok) throw new Error(json?.error || "Gagal memuat billing");
        if (cancelled) return;
        setPayments(Array.isArray(json?.payments) ? json!.payments.slice(0, 5) : []);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat billing");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = useMemo(
    () => payments.filter((p) => (p.status ?? "").toLowerCase() === "pending").length,
    [payments]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Top-up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Memuat...</div>
        ) : payments.length === 0 ? (
          <div className="text-sm text-muted-foreground">Belum ada pembayaran.</div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Pending: {pendingCount}</div>
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium">{p.invoice?.number ? `Invoice ${p.invoice.number}` : `Payment #${p.id}`}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString("id-ID")} · {p.status}</div>
                </div>
                <div className="text-sm tabular-nums">{formatCurrencyUsd(p.amountCents)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Link className="flex-1" href="/dashboard/buy-token"><Button className="w-full">Top Up</Button></Link>
          <Link className="flex-1" href="/dashboard/payments"><Button className="w-full" variant="outline">Lihat semua</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}
