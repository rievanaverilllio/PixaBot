"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const history = [
  { id: 1, action: "Chat request", tokens: 12, when: "2026-01-11 09:12" },
  { id: 2, action: "Image generation", tokens: 40, when: "2026-01-11 08:43" },
  { id: 3, action: "API call", tokens: 5, when: "2026-01-10 18:20" },
];

export function TokenHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Penggunaan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{h.action}</div>
                <div className="text-xs text-muted-foreground">{h.when}</div>
              </div>
              <div className="text-sm tabular-nums">-{h.tokens} tx</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
