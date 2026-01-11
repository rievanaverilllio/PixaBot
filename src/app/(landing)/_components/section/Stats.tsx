"use client";

import Image from "next/image";
import partnerImg from "../../../../../media/partner.png";
import partner2 from "../../../../../media/partner2.png";
import partner3 from "../../../../../media/partner3.png";
import partner4 from "../../../../../media/partner4.png";
import { Zap, ImageIcon, Layers, CheckCircle } from "lucide-react";

export default function Stats() {
  const items = [
    { label: "Average response", value: "120ms", icon: <Zap className="h-5 w-5 text-primary" />, hint: "Median latency" },
    { label: "Images generated", value: "1.2M+", icon: <ImageIcon className="h-5 w-5 text-amber-500" />, hint: "High-fidelity images" },
    { label: "Active apps", value: "15k+", icon: <Layers className="h-5 w-5 text-sky-500" />, hint: "Live integrations" },
    { label: "Uptime", value: "99.99%", icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, hint: "30d rolling" },
  ];

  const logos = [
    { src: partnerImg, label: "Mistral" },
    { src: partner2, label: "Claude" },
    { src: partner3, label: "LLaVa" },
    { src: partner4, label: "Gemini" },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-transparent to-muted/3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Trusted at scale</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">Low latency, high throughput, and enterprise controls trusted by production teams.</p>
          </div>
          <div className="text-sm text-muted-foreground">SLA-ready • Audit logs • Scoped API keys</div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.label} className="rounded-lg bg-card p-4 flex items-center gap-4">
              <div className="p-3 rounded-md bg-muted/20">{it.icon}</div>
              <div>
                <div className="text-xl font-bold">{it.value}</div>
                <div className="text-sm text-muted-foreground">{it.label} <span className="text-xs text-muted-foreground/80">· {it.hint}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {logos.map((logo) => (
                <div key={logo.label} className="flex items-center gap-0 px-1 py-1 bg-muted/5 rounded">
                  <div className="h-4 w-14 flex items-center justify-center">
                    <Image src={logo.src} alt={logo.label} width={38} height={16} className="object-contain" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground/90">{logo.label}</div>
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">Join thousands of teams running PixaBot in production.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
