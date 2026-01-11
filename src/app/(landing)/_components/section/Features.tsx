"use client";

import { Rocket, ImageIcon, Zap, PieChart } from "lucide-react";

export default function Features() {
  const items = [
    { icon: <Rocket className="h-6 w-6 text-primary" />, title: "Stateful Chat", lead: "Keep context across sessions.", desc: "Multi-turn conversations with memory and metadata support for richer assistant replies." },
    { icon: <ImageIcon className="h-6 w-6 text-amber-500" />, title: "Image Generation", lead: "On-demand visuals.", desc: "Generate high-quality images from prompts, with size and style controls via secure proxy endpoints." },
    { icon: <Zap className="h-6 w-6 text-indigo-600" />, title: "Automation", lead: "Actionable outputs.", desc: "Extract actions, summaries, or follow-up tasks automatically from conversations." },
    { icon: <PieChart className="h-6 w-6 text-sky-500" />, title: "Billing & Metrics", lead: "Predictable usage", desc: "Token-based billing, detailed metrics, and exportable invoices for teams and enterprises." },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">What PixaBot offers</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">A cohesive platform combining conversational AI, image generation, and the tools you need to deploy at scale.</p>
          </div>
          <div className="hidden md:block text-right text-sm text-muted-foreground">Built for production — reproducible, auditable, and easy to integrate.</div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-lg bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-muted/30 p-3">{it.icon}</div>
                <div>
                  <div className="font-semibold text-lg">{it.title}</div>
                  <div className="text-sm mt-1 text-muted-foreground">{it.lead}</div>
                  <div className="mt-3 text-sm text-muted-foreground">{it.desc}</div>
                  <div className="mt-4">
                    <a href="/help" className="text-sm underline">Learn more</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
