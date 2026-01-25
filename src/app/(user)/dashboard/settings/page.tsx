"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit2, CreditCard, Key, ShieldCheck, Trash2, User, Mail, Zap } from "lucide-react";

type SettingsResponse = {
  profile: { name: string; email: string; image: string | null; role: string };
  settings: { twoFaEnabled: boolean; notificationsEnabled: boolean; language: string | null; timezone: string | null };
  billing: { tokenBalance: number; lastTopupAt: string | null };
  payments: Array<{
    id: number;
    status: string;
    provider: string | null;
    amountCents: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    invoice: null | {
      id: number;
      number: string;
      status: string;
      amountCents: number;
      currency: string;
      issuedAt: string;
      paidAt: string | null;
      pdfUrl: string | null;
    };
  }>;
};

export default function SettingsPage() {
  const router = useRouter();
  const { status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState<string>("user");
  const [twoFa, setTwoFa] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");

  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [lastTopupAt, setLastTopupAt] = useState<string | null>(null);
  const [payments, setPayments] = useState<SettingsResponse["payments"]>([]);

  const initials = useMemo(() => {
    const trimmed = (name ?? "").trim();
    if (!trimmed) return "UN";
    const parts = trimmed.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "UN";
  }, [name]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/v2/login");
      return;
    }
    if (status !== "authenticated") return;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/user/settings", { method: "GET" });
        const json = (await res.json().catch(() => null)) as SettingsResponse | { error?: string } | null;
        if (!res.ok) throw new Error((json as any)?.error || "Failed to load settings");

        if (cancelled) return;
        const data = json as SettingsResponse;
        setName(data.profile.name ?? "");
        setEmail(data.profile.email ?? "");
        setAvatar(data.profile.image ?? null);
        setRole(data.profile.role ?? "user");
        setTwoFa(Boolean(data.settings.twoFaEnabled));
        setNotifications(Boolean(data.settings.notificationsEnabled));
        setLanguage(data.settings.language ?? "");
        setTimezone(data.settings.timezone ?? "");
        setTokenBalance(Number(data.billing.tokenBalance ?? 0));
        setLastTopupAt(data.billing.lastTopupAt ?? null);
        setPayments(Array.isArray(data.payments) ? data.payments : []);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Failed to load settings");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, router]);

  const saveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          twoFaEnabled: twoFa,
          notificationsEnabled: notifications,
          language,
          timezone,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to save settings");
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pengaturan Akun</h1>
            <p className="text-sm text-muted-foreground">Kelola profil, keamanan, pembayaran, dan integrasi API Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/api-keys">
              <Button variant="outline">Kelola API</Button>
            </Link>
            <Button onClick={saveAll} disabled={isLoading || isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Semua"}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatar || undefined} alt={name || "avatar"} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="mt-3 w-full">
                    <Label>Nama Lengkap</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full" />
                    <Label className="mt-3">Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => toast.info("Gunakan tombol 'Simpan Semua' untuk menyimpan perubahan.")}
                    >
                      <Edit2 className="mr-2" />Ubah Profil
                    </Button>
                    <Button
                      onClick={() => toast.info("Unggah avatar belum diaktifkan.")}
                    >
                      Unggah Avatar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferensi & Informasi Akun (moved under Profile) */}
            <Card>
              <CardHeader>
                <CardTitle>Preferensi & Informasi Akun</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Bahasa</Label>
                    <Input placeholder="Bahasa (ID)" className="mt-2 w-full" value={language} onChange={(e) => setLanguage(e.target.value)} />
                  </div>
                  <div>
                    <Label>Zona Waktu</Label>
                      <Input placeholder="Asia/Jakarta" className="mt-2 w-full" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">Perubahan preferensi akan diterapkan segera setelah Anda menyimpan.</div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Notifications */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Keamanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <Label>Ubah Kata Sandi</Label>
                    <div className="mt-2 grid gap-2">
                      <Input placeholder="Kata sandi saat ini" type="password" />
                      <Input placeholder="Kata sandi baru" type="password" />
                      <Input placeholder="Konfirmasi kata sandi" type="password" />
                      <div className="flex justify-end">
                        <Button>Perbarui Kata Sandi</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-factor Authentication (2FA)</div>
                      <p className="text-sm text-muted-foreground">Aktifkan otentikasi dua langkah untuk keamanan tambahan.</p>
                    </div>
                    <Switch checked={twoFa} onCheckedChange={(v) => setTwoFa(Boolean(v))} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email notifikasi</div>
                    <p className="text-sm text-muted-foreground">Terima ringkasan pemakaian dan informasi tagihan.</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={(v) => setNotifications(Boolean(v))} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing / Integrations */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Tagihan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Paket</div>
                    <div className="text-sm font-medium capitalize mt-1">{role || "user"}</div>
                    <div className="h-3" />
                    <div className="text-sm text-muted-foreground">Saldo Token</div>
                    <div className="text-2xl font-semibold mt-1 tabular-nums">{tokenBalance.toLocaleString("id-ID")}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Terakhir top-up: {lastTopupAt ? new Date(lastTopupAt).toLocaleDateString("id-ID") : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/dashboard/buy-token">
                      <Button>Top Up</Button>
                    </Link>
                    <Link href="/dashboard/payments">
                      <Button variant="outline"><CreditCard className="mr-2" />Pembayaran</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Belum ada pembayaran.</div>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 8).map((p) => {
                      const amount = (p.amountCents ?? 0) / 100;
                      const invoiceNo = p.invoice?.number ?? "-";
                      return (
                        <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{invoiceNo}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(p.createdAt).toLocaleString("id-ID")} · {String(p.provider ?? "-")}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">Status: {p.status}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">${amount.toFixed(2)}</div>
                            {p.invoice?.pdfUrl ? (
                              <Link href={p.invoice.pdfUrl} target="_blank" className="text-xs underline text-muted-foreground">
                                Invoice
                              </Link>
                            ) : (
                              <div className="text-xs text-muted-foreground">&nbsp;</div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-end">
                      <Link href="/dashboard/payments">
                        <Button variant="outline" size="sm">Lihat semua</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            
          </div>
        </div>

        
      </div>
    </div>
  );
}
