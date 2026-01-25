"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletMinimal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenUsageChart } from "./_components/token-usage-chart";
import { TopUpCard } from "./_components/topup-card";
import { TokenHistory } from "./_components/token-history";
import { TokenBillingOverview } from "./_components/token-billing-overview";

type DashboardSummaryDto = {
  wallet: {
    balance: number;
  };
  today: {
    chatCount: number;
    imageCount: number;
    tokensSpent: number;
  };
};

export default function TokenDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dashboard/summary", { method: "GET" });
        const json = (await res.json().catch(() => null)) as DashboardSummaryDto | { error?: string } | null;
        if (!res.ok) throw new Error((json as any)?.error || "Gagal memuat ringkasan");
        if (cancelled) return;
        setSummary(json as DashboardSummaryDto);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat ringkasan");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const balance = summary?.wallet?.balance ?? 0;
  const todayUsage = useMemo(() => summary?.today?.tokensSpent ?? 0, [summary]);

  return (
    <div>
      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="activity">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <TopUpCard balance={balance} isLoading={isLoading} />

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Pemakaian Hari Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-0.5">
                    <p className="font-medium text-xl tabular-nums">{todayUsage.toLocaleString("en-US")}</p>
                    <p className="text-muted-foreground text-xs">Estimated token usage</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Shortcut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline"><a href="/dashboard/pixachat">Buka Pixachat</a></Button>
                  </div>
                </CardContent>
              </Card>

              <TokenBillingOverview />
            </div>

            {/* Additional layout can mirror finance page */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="flex flex-col gap-4">
                <TokenUsageChart />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <TokenHistory />
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="grid size-7 place-content-center rounded-sm bg-muted">
                            <WalletMinimal className="size-5" />
                          </span>
                          Pemakaian Hari Ini
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold tabular-nums">{todayUsage.toLocaleString("id-ID")}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Chat: {summary?.today?.chatCount ?? 0} · Image: {summary?.today?.imageCount ?? 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
