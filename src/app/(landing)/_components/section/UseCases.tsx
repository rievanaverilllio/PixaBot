"use client";

import { Briefcase, ImageIcon, Zap } from "lucide-react";

export default function UseCases() {
  const cases = [
    { icon: <Briefcase className="h-6 w-6 text-sky-600" />, title: "Customer support", desc: "Automate responses, summarize threads, and surface suggested images for agents." },
    { icon: <ImageIcon className="h-6 w-6 text-amber-500" />, title: "Content & Design", desc: "Generate on-brand imagery, variant mockups, and creative assets programmatically." },
    { icon: <Zap className="h-6 w-6 text-indigo-600" />, title: "Productivity", desc: "Context-aware automations: summarize, extract actions, and trigger workflows." },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-transparent to-muted/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Use cases</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">Practical applications across teams — deploy within your product, tooling, or internal workflows.</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-sm text-muted-foreground">Enterprise-ready integrations</div>
            <div className="mt-2">
              <a href="/docs" className="underline">See integration guides</a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {cases.map((c) => (
            <div key={c.title} className="rounded-lg bg-card p-6 hover:translate-y-[-4px] transition-transform shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-muted/40 p-3">{c.icon}</div>
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{c.desc}</div>
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
