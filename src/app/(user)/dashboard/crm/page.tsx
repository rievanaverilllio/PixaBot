import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <CardTitle>CRM</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Silakan login untuk melihat data.</CardContent>
      </Card>
    );
  }

  const [chatCount, imageCount, recentUsage, recentThreads] = await Promise.all([
    prisma.usageEvent.count({ where: { userId, kind: "chat" } }),
    prisma.usageEvent.count({ where: { userId, kind: "image" } }),
    prisma.usageEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, kind: true, action: true, tokens: true, createdAt: true },
    }),
    prisma.chatThread.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Aktivitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chat digunakan</span>
              <span className="font-medium tabular-nums">{chatCount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Image digunakan</span>
              <span className="font-medium tabular-nums">{imageCount.toLocaleString("id-ID")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat Threads Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentThreads.length === 0 ? (
              <div className="text-sm text-muted-foreground">Belum ada thread.</div>
            ) : (
              recentThreads.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.title ?? `Thread #${t.id}`}</div>
                    <div className="text-xs text-muted-foreground">{new Date(t.updatedAt).toLocaleString("id-ID")}</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Events Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentUsage.length === 0 ? (
            <div className="text-sm text-muted-foreground">Belum ada event.</div>
          ) : (
            recentUsage.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">
                    {e.kind === "image" ? "Image" : e.kind === "chat" ? "Chat" : e.kind}
                    {e.action ? ` • ${e.action}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString("id-ID")}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">
                  {e.tokens ? `${e.tokens.toLocaleString("id-ID")} token` : "-"}
                </div>
              </div>
            ))
          )}
          <div className="pt-2 text-xs text-muted-foreground">Data ini diambil dari backend (UsageEvent & ChatThread).</div>
        </CardContent>
      </Card>
    </div>
  );
}
