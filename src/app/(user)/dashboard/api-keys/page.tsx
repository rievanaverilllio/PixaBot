"use client";

import { Key, Clipboard, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

const initialKeys = [
  { id: "k_1", name: "Default Key", key: "sk-••••••••••••••1", created: "2026-01-01", quota: "10k" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(initialKeys);
  const [activeNewKey, setActiveNewKey] = useState<string | null>(null);
  const [showRevoke, setShowRevoke] = useState<string | null>(null);

  function createKey() {
    const id = `k_${Date.now()}`;
    const fullKey = `sk_live_${Math.random().toString(36).slice(2, 18)}`;
    const short = `sk-${fullKey.slice(-6)}`;
    const newKey = { id, name: "New Key", key: short, created: new Date().toISOString().slice(0, 10), quota: "unlimited" };
    setKeys((s) => [newKey, ...s]);
    // show full key in dialog (for demo: using short masked in list)
    setActiveNewKey(fullKey);
  }

  function confirmRevoke(id: string) {
    setShowRevoke(id);
  }

  function revoke(id: string) {
    setKeys((s) => s.filter((k) => k.id !== id));
    setShowRevoke(null);
    toast.success("API key revoked");
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (e) {
      toast.error("Copy failed");
    }
  }

  const curlExample = `curl -X POST "https://api.example.com/v1/chat" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Halo"}'`;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle className="!text-lg">API & Kunci</CardTitle>
              </div>

              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="mr-2" />Buat Kunci Baru</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Buat API Key Baru</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 text-sm">
                      <p>Kunci baru akan dibuat dan ditampilkan sekali. Simpan kunci tersebut di tempat aman.</p>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={createKey}>Buat dan Tampilkan</Button>
                      </div>
                    </div>
                    <DialogFooter />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{k.name}</div>
                      <div className="text-xs rounded bg-muted/30 px-2 py-0.5 text-muted-foreground">{k.quota}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{k.created}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm text-muted-foreground px-3 py-1 rounded bg-muted/10">{k.key}</div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => copy(k.key)}>
                          <Clipboard className="mr-2" />Copy
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy key</TooltipContent>
                    </Tooltip>
                    <Dialog open={showRevoke === k.id} onOpenChange={(open) => !open && setShowRevoke(null)}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revoke API Key</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2 text-sm">Anda yakin ingin mencabut kunci ini? Aksi ini tidak dapat dibatalkan.</div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowRevoke(null)}>Batal</Button>
                          <Button variant="destructive" onClick={() => revoke(k.id)}><Trash2 className="mr-2" />Revoke</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" onClick={() => confirmRevoke(k.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium">Contoh Pemanggilan API</h4>
              <pre className="mt-2 bg-muted/10 p-3 rounded text-sm whitespace-pre-wrap break-words max-w-full">{curlExample}</pre>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copy(curlExample)}><Clipboard className="mr-2" />Copy Snippet</Button>
                <Button size="sm" onClick={() => toast.success('Lihat dokumentasi lengkap di /help')}>Lihat Dokumentasi</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Key dialog showing generated key once */}
        <Dialog open={Boolean(activeNewKey)} onOpenChange={(open) => !open && setActiveNewKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kunci Baru</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <p className="text-sm">Simpan kunci ini sekarang. Anda tidak akan melihatnya lagi setelah menutup dialog.</p>
              <div className="mt-3 font-mono bg-muted/10 p-3 rounded text-sm break-words">{activeNewKey ?? ""}</div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveNewKey(null)}>Tutup</Button>
                <Button onClick={() => activeNewKey && copy(activeNewKey)}>Copy</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
