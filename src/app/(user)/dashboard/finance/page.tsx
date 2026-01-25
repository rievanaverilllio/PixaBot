import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";

function getUserIdFromSession(session: unknown): number | null {
  const s = session as { user?: { id?: string } } | null;
  const id = s?.user?.id;
  if (!id) return null;
  const n = Number.parseInt(String(id), 10);
  return Number.isFinite(n) ? n : null;
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userId = getUserIdFromSession(session);
  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finance</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Silakan login untuk melihat data.</CardContent>
      </Card>
    );
  }

  const [wallet, topups, usages, recentTransactions] = await Promise.all([
    prisma.tokenWallet.findUnique({ where: { userId }, select: { balance: true, updatedAt: true } }),
    prisma.tokenTransaction.aggregate({
      where: { userId, amount: { gt: 0 } },
      _sum: { amount: true },
    }),
    prisma.tokenTransaction.aggregate({
      where: { userId, amount: { lt: 0 } },
      _sum: { amount: true },
    }),
    prisma.tokenTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, type: true, amount: true, note: true, createdAt: true },
    }),
  ]);

  const balance = wallet?.balance ?? 0;
  const totalTopup = topups._sum.amount ?? 0;
  const totalUsage = Math.abs(usages._sum.amount ?? 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{balance.toLocaleString("id-ID")}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Update: {wallet?.updatedAt ? new Date(wallet.updatedAt).toLocaleString("id-ID") : "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Top Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{totalTopup.toLocaleString("id-ID")}</div>
            <div className="mt-1 text-xs text-muted-foreground">Akumulasi semua transaksi +token</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Pemakaian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{totalUsage.toLocaleString("id-ID")}</div>
            <div className="mt-1 text-xs text-muted-foreground">Akumulasi semua transaksi -token</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {recentTransactions.length === 0 ? (
              <div className="text-sm text-muted-foreground">Belum ada transaksi.</div>
            ) : (
              recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{t.note ?? t.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold tabular-nums ${t.amount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {t.amount >= 0 ? "+" : "-"}
                    {Math.abs(t.amount).toLocaleString("id-ID")}
                  </div>
                </div>
              ))
            )}
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">
            Data ini bersumber dari wallet & token transactions (backend).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
