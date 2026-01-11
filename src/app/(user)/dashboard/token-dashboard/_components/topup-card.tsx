"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function TopUpCard({ balance = 1200 }: { balance?: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <Wallet className="size-5" />
            </span>
            Saldo Token
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(balance, { noDecimals: true })}</p>
          <p className="text-sm text-muted-foreground">Sisa token yang tersedia</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1">Top-up</Button>
          <Button className="flex-1" variant="outline">
            Paket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
