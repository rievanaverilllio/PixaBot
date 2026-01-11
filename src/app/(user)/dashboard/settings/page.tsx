"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit2, CreditCard, Key, ShieldCheck, Trash2, User, Mail, Zap } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [twoFa, setTwoFa] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pengaturan Akun</h1>
            <p className="text-sm text-muted-foreground">Kelola profil, keamanan, pembayaran, dan integrasi API Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/api-keys">
              <Button variant="outline">Kelola API</Button>
            </Link>
            <Button>Save All</Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="min-h-[220px]">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/media/avatar-placeholder.png" alt="avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="mt-3 w-full">
                  <Label>Nama Lengkap</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
                  <Label className="mt-3">Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline"><Edit2 className="mr-2" />Ubah Profil</Button>
                  <Button>Unggah Avatar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <div className="text-sm text-muted-foreground">Saldo Token</div>
                    <div className="text-2xl font-semibold mt-1">1,250</div>
                    <div className="text-sm text-muted-foreground mt-1">Terakhir top-up: 5 Jan 2026</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/buy-token">
                      <Button>Top Up</Button>
                    </Link>
                    <Link href="/payments">
                      <Button variant="outline"><CreditCard className="mr-2" />Pembayaran</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User />
                      <div>
                        <div className="font-medium">GitHub</div>
                        <div className="text-sm text-muted-foreground">Terhubung sejak 12 Nov 2025</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">Manage</Button>
                      <Button variant="destructive"><Trash2 /></Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap />
                      <div>
                        <div className="font-medium">Slack</div>
                        <div className="text-sm text-muted-foreground">Terhubung sejak 20 Okt 2025</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">Manage</Button>
                      <Button variant="destructive"><Trash2 /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi & Informasi Akun</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Bahasa</Label>
                    <Input placeholder="Bahasa (ID)" className="mt-2" />
                  </div>
                  <div>
                    <Label>Zona Waktu</Label>
                    <Input placeholder="Asia/Jakarta" className="mt-2" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">Perubahan preferensi akan diterapkan segera setelah Anda menyimpan.</div>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone removed per user request */}
        </div>
      </div>
    </div>
  );
}
