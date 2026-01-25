"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopUpCard({ balance, isLoading }: { balance: number; isLoading?: boolean }) {
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
          <p className="text-2xl font-semibold tabular-nums">{balance.toLocaleString("id-ID")}</p>
          <p className="text-sm text-muted-foreground">{isLoading ? "Memuat saldo..." : "Sisa token yang tersedia"}</p>
        </div>
        <div className="flex gap-2">
          <Link className="flex-1" href="/dashboard/buy-token">
            <Button className="w-full">Top-up</Button>
          </Link>
          <Link className="flex-1" href="/dashboard/payments">
            <Button className="w-full" variant="outline">Paket</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
