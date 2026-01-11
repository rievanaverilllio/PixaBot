"use client";

import Link from "next/link";
import { useState } from "react";
import { Banknote, Check, Star, CreditCard, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const packages = [
  {
    id: 1,
    title: "Starter",
    tokens: 500,
    price: 5,
    features: ["Basic chat", "100 image credits"],
  },
  {
    id: 2,
    title: "Pro",
    tokens: 3000,
    price: 25,
    features: ["Priority responses", "500 image credits", "API access"],
    recommended: true,
  },
  {
    id: 3,
    title: "Business",
    tokens: 10000,
    price: 70,
    features: ["Team seats", "Unlimited images (fair use)", "SLA & invoices"],
  },
];

const methods = [
  { id: "card", label: "Visa / Mastercard", icon: CreditCard },
  { id: "quick", label: "Instant Checkout", icon: Zap },
  { id: "bank", label: "Manual Transfer (Invoice)", icon: Banknote },
];

export default function BuyTokenPage() {
  const [selected, setSelected] = useState(packages[1]);
  const [payMethod, setPayMethod] = useState(methods[0].id);

  function handleBuy() {
    toast.success(`Checkout: ${selected.title} — ${selected.tokens} tokens`);
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl font-bold">Beli Token untuk API & Chat</h1>
            <p className="mt-2 text-muted-foreground">Pilih paket token yang paling cocok untuk tim Anda. Token langsung ditambahkan setelah pembayaran berhasil.</p>
            <div className="mt-4 flex gap-3">
              <Link href="/history">
                <Button variant="outline">Lihat Riwayat</Button>
              </Link>
              <Link href="/payments">
                <Button>Kelola Pembayaran</Button>
              </Link>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-4 py-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div className="text-sm">Best value: Pro</div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((p) => (
              <Card key={p.id} className={`${p.recommended ? "scale-105" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="m-0">{p.title}</CardTitle>
                      <CardDescription className="m-0 text-sm">{p.tokens} tokens</CardDescription>
                    </div>
                    {p.recommended ? <Badge>Recommended</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div>
                    <div className="text-3xl font-extrabold">${p.price}</div>
                    <div className="text-sm text-muted-foreground">One-time · Tokens added instantly</div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelected(p)} className="w-full mt-4">Beli {p.title}</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Checkout — {p.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div className="text-sm">Jumlah token: <strong>{p.tokens}</strong></div>
                          <div className="text-sm mt-2">Total: <strong>${p.price}</strong></div>

                          <div className="mt-4">
                            <div className="text-sm text-muted-foreground">Pilih metode pembayaran</div>
                            <div className="mt-2 grid gap-2 md:grid-cols-3">
                              {methods.map((m) => (
                                <Button key={m.id} variant={payMethod === m.id ? undefined : "outline"} onClick={() => setPayMethod(m.id)}>
                                  <m.icon className="mr-2 h-4 w-4" /> {m.label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {}}>Cancel</Button>
                            <Button onClick={handleBuy}>Confirm & Pay</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Keunggulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-sm">
                  <div className="font-medium">Pembayaran Aman</div>
                  <div className="text-muted-foreground">All payments are processed securely.</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Active Support</div>
                  <div className="text-muted-foreground">Priority support for Pro & Business customers.</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Flexible Invoicing</div>
                  <div className="text-muted-foreground">Download invoices and manage billing details.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
