"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type TxDto = {
  id: number;
  type: string;
  amount: number;
  note: string | null;
  createdAt: string;
};

export function TokenHistory() {
  const [items, setItems] = useState<TxDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dashboard/token/transactions?take=10", { method: "GET" });
        const json = (await res.json().catch(() => null)) as { transactions?: TxDto[]; error?: string } | null;
        if (!res.ok) throw new Error(json?.error || "Gagal memuat riwayat token");
        if (cancelled) return;
        setItems(Array.isArray(json?.transactions) ? json!.transactions : []);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat riwayat token");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Penggunaan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Belum ada transaksi.</div>
          ) : (
            items.map((t) => {
              const sign = t.amount >= 0 ? "+" : "";
              const label = t.note ?? t.type;
              const when = new Date(t.createdAt).toLocaleString("id-ID");
              return (
                <div key={t.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{when}</div>
                  </div>
                  <div className="text-sm tabular-nums">{sign}{t.amount} tx</div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
