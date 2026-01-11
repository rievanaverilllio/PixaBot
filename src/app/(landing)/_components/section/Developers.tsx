"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Developers() {
  return (
    <section className="py-12 bg-muted/5">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 lg:grid-cols-2 items-start">
        <div>
          <h2 className="text-2xl font-semibold">For developers</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">APIs, SDKs, and quick-start guides to integrate PixaBot into your product or tooling quickly.</p>

          <div className="mt-6 rounded-lg bg-card p-4">
            <div className="text-sm text-muted-foreground">Quickstart (browser)</div>
            <pre className="mt-3 rounded bg-muted/10 p-4 text-sm overflow-auto">{`// Send a message to the assistant
fetch('/api/pixachat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Summarize user conversation' })
}).then(r => r.json()).then(console.log)`}</pre>

            <div className="mt-4 flex gap-3">
              <Link href="/docs">
                <Button variant="outline">Read docs</Button>
              </Link>
              <Link href="/v2/login">
                <Button>Get API key</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-card p-4">
            <div className="font-medium">SDKs & tooling</div>
            <div className="mt-2 text-sm text-muted-foreground">Official SDKs for Node, Python, and client integrations — install and authenticate in minutes.</div>
            <div className="mt-4 flex gap-2">
              <Link href="#" className="text-sm underline">Node SDK</Link>
              <Link href="#" className="text-sm underline">Python SDK</Link>
              <Link href="#" className="text-sm underline">REST API</Link>
            </div>
          </div>

          <div className="rounded-lg bg-card p-4">
            <div className="font-medium">Security & keys</div>
            <div className="mt-2 text-sm text-muted-foreground">Create scoped API keys for environments and rotate them regularly for safety.</div>
            <div className="mt-4">
              <Link href="/v2/login">
                <Button variant="outline">Manage keys</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-muted/30 to-muted/60 p-1">
            <div className="bg-card rounded-lg p-4">
              <div className="font-medium">Need help?</div>
              <div className="mt-2 text-sm text-muted-foreground">Our developer support and integration docs will get you past any blockers.</div>
              <div className="mt-4">
                <Link href="/help">
                  <Button>Contact support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
