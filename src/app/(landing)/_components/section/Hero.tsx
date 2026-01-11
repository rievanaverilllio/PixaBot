"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import mockImg from "../../../../../media/mock.png";

export default function Hero() {
  return (
    <section className="bg-transparent py-20">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <Badge>Introducing</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold">PixaBot — Enterprise-ready conversational AI</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Deploy a production-grade assistant with integrated image generation, predictable token billing, and
            developer-friendly APIs. Designed for reliability, privacy, and scale.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground max-w-md">
            <li>• Stateful conversations with context and conversation history</li>
            <li>• High-throughput image generation via proxy endpoints</li>
            <li>• Enterprise controls: API keys, audit logs, and data residency</li>
          </ul>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/v2/login">
              <Button size="lg">Start free trial</Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">Read docs</Button>
            </Link>
          </div>
        </div>

        <div className="order-first lg:order-last">
          <div className="rounded-xl shadow-lg p-1 bg-gradient-to-br from-muted/40 to-muted/60">
            <div className="bg-card rounded-lg p-6 text-sm text-muted-foreground">
              <div className="h-[360px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium">PixaBot Console</div>
                  <div className="text-xs text-muted-foreground">Preview</div>
                </div>
                <div className="flex-1 rounded-md bg-muted/10 border border-muted/20 overflow-hidden">
                  <div className="relative h-full w-full">
                    <Image src={mockImg} alt="Dashboard mock" className="object-contain" fill />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Includes chat logs, billing, and API keys management.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
