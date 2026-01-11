import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletMinimal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TokenUsageChart } from "./_components/token-usage-chart";
import { TopUpCard } from "./_components/topup-card";
import { TokenHistory } from "./_components/token-history";
import { CardOverview } from "@/app/(user)/dashboard/finance/_components/card-overview";

export default function TokenDashboardPage() {
  const balance = 1200;
  const todayUsage = 25;

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
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="grid size-7 place-content-center rounded-sm bg-muted">
                        <WalletMinimal className="size-5" />
                      </span>
                      Saldo Token
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-0.5">
                    <p className="font-medium text-xl tabular-nums">{formatCurrency(balance, { noDecimals: true })}</p>
                    <p className="text-muted-foreground text-xs">Available tokens</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="flex-1" size="sm">
                      Top-up
                    </Button>
                    <Button className="flex-1" size="sm" variant="outline">
                      Beli Paket
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Pemakaian Hari Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-0.5">
                    <p className="font-medium text-xl tabular-nums">{todayUsage}</p>
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
                    <Button variant="outline">PixaChat</Button>
                    <Button variant="outline">Image Generator</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Riwayat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Lihat penggunaan dan tagihan terakhir Anda.</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional layout can mirror finance page */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="flex flex-col gap-4">
                <TokenUsageChart />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <TopUpCard />
                  <TokenHistory />
                </div>
              </div>

              <CardOverview />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
