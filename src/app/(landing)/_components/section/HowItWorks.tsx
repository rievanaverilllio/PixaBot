"use client";

import { Terminal, MessageCircle, ImageIcon, CreditCard } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { id: 1, title: "Integrate", desc: "Install the SDK or call our REST API with a few lines of code.", icon: <Terminal className="h-5 w-5 text-sky-500" /> },
    { id: 2, title: "Converse", desc: "Send messages and receive context-aware assistant replies in real time.", icon: <MessageCircle className="h-5 w-5 text-indigo-500" /> },
    { id: 3, title: "Create Images", desc: "Compose prompts and generate high-quality images via secure proxy endpoints.", icon: <ImageIcon className="h-5 w-5 text-amber-500" /> },
    { id: 4, title: "Scale & Charge", desc: "Measure usage with tokens, manage invoices, and scale with confidence.", icon: <CreditCard className="h-5 w-5 text-emerald-500" /> },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold">How PixaBot works</h2>
        <p className="mt-2 text-muted-foreground max-w-3xl">A clear, secure workflow that gets your team from integration to production quickly.</p>

        <div className="mt-8 relative">
          {/* horizontal connector line */}
          <div className="hidden md:block absolute left-0 right-0 top-6 h-px bg-border" />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex-1 relative flex md:flex-col items-start md:items-center gap-4">
                <div className="flex items-center gap-4 md:flex-col md:gap-2">
                  <div className="relative z-10">
                    <div className="flex items-center justify-center rounded-full bg-card border border-border w-12 h-12 shadow-sm">
                      {s.icon}
                    </div>
                    <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 md:hidden w-16 h-px bg-border" />
                  </div>

                  <div className="md:mt-2">
                    <div className="text-lg font-semibold">{s.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground max-w-xs">{s.desc}</div>
                  </div>
                </div>

                {/* vertical connector for small screens */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden absolute left-6 top-full w-px h-6 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
