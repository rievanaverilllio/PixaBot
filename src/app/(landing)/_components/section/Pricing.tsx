"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const features = [
  "Stateful conversations",
  "Image generation",
  "API access",
  "Priority support",
  "Usage analytics",
];

const tiers = [
  { id: 'starter', name: 'Starter', price: '$5/mo', tokens: '500', highlights: ['Quick start'], recommended: false },
  { id: 'pro', name: 'Pro', price: '$25/mo', tokens: '3,000', highlights: ['API access', 'Priority support'], recommended: true },
  { id: 'business', name: 'Business', price: '$70/mo', tokens: '10,000', highlights: ['SLA & Invoices', 'Enterprise support'], recommended: false },
];

export default function Pricing() {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Pricing</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">Choose a plan that fits your team's needs. Token-based billing keeps costs predictable as you scale.</p>
          </div>
          <div className="text-sm text-muted-foreground">Pay monthly or contact us for custom enterprise pricing.</div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.id} className={`p-0 overflow-hidden ${t.recommended ? 'ring-1 ring-primary/30 scale-105' : ''}`}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.tokens} tokens included</div>
                  </div>
                  {t.recommended && <div className="text-xs text-primary font-medium">Recommended</div>}
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-extrabold">{t.price}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{t.highlights.join(' • ')}</div>
                </div>

                <div className="mt-6">
                  <Link href="/pricing">
                    <Button className="w-full">Start {t.name}</Button>
                  </Link>
                </div>
              </div>

              <div className="border-t border-border bg-muted/5 p-4">
                <div className="text-sm font-medium mb-2">Included features</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">For volume discounts, SSO, or custom SLAs, <Link href="/contact" className="underline">contact sales</Link>.</div>
      </div>
    </section>
  );
}
