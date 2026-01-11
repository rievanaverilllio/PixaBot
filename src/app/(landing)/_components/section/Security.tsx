"use client";

import { ShieldCheck, FileText, Key } from "lucide-react";

export default function Security() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 lg:grid-cols-2 items-start">
        <div>
          <h2 className="text-2xl font-semibold">Security & compliance</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">Enterprise-grade protections, auditability, and clear privacy controls so you can deploy with confidence.</p>

          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-muted/40 p-2"><ShieldCheck className="h-5 w-5 text-emerald-500" /></div>
              <div>
                <div className="font-medium">Certifications & audits</div>
                <div className="text-sm text-muted-foreground">SOC2-ready controls and regular third-party security assessments.</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="rounded-full bg-muted/40 p-2"><Key className="h-5 w-5 text-sky-500" /></div>
              <div>
                <div className="font-medium">Access & key management</div>
                <div className="text-sm text-muted-foreground">Scoped API keys, team roles, and rotation policies to protect access.</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="rounded-full bg-muted/40 p-2"><FileText className="h-5 w-5 text-amber-500" /></div>
              <div>
                <div className="font-medium">Data handling & retention</div>
                <div className="text-sm text-muted-foreground">Configurable retention policies and optional opt-out for training data.</div>
              </div>
            </li>
          </ul>

          <div className="mt-6 flex gap-3">
            <a href="/docs" className="underline">Read compliance docs</a>
            <a href="/contact" className="text-sm inline-block px-3 py-1 rounded bg-primary text-white">Contact sales</a>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-muted/30 to-muted/60 p-1">
          <div className="bg-card rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Example security controls</div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-md bg-muted/10 p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">API key scope</div>
                  <div className="text-xs text-muted-foreground">Limit keys to read-only or image-generation.</div>
                </div>
                <div className="text-xs text-muted-foreground">Enabled</div>
              </div>

              <div className="rounded-md bg-muted/10 p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">Retention policy</div>
                  <div className="text-xs text-muted-foreground">30 days (default)</div>
                </div>
                <div className="text-xs text-muted-foreground">Change</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
