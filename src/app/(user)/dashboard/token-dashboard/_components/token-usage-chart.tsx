"use client";

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type UsageSeriesItem = { date: string; day: string; tokens: number };

export function TokenUsageChart() {
  const [data, setData] = useState<Array<{ day: string; usage: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dashboard/token/usage?days=7", { method: "GET" });
        const json = (await res.json().catch(() => null)) as { series?: UsageSeriesItem[]; error?: string } | null;
        if (!res.ok) throw new Error(json?.error || "Gagal memuat chart token");
        if (cancelled) return;
        const series = Array.isArray(json?.series) ? json!.series : [];
        setData(series.map((x) => ({ day: x.day, usage: x.tokens })));
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat chart token");
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
        <CardTitle>Penggunaan Token (7 hari)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Memuat...</div>
          ) : (
            <BarChart width={600} height={200} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
