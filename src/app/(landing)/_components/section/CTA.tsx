"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center bg-card rounded-lg p-6 shadow-md">
          <div>
            <h3 className="text-2xl font-semibold">Ready to add PixaBot to your product?</h3>
            <p className="mt-2 text-muted-foreground max-w-lg">Start a free trial, integrate in minutes, and scale with predictable token billing. Trusted by product teams and agencies.</p>

            <ul className="mt-4 grid gap-2 text-sm">
              <li className="flex items-start gap-3"><span className="text-primary">•</span> Stateful conversations and context</li>
              <li className="flex items-start gap-3"><span className="text-primary">•</span> High-quality image generation</li>
              <li className="flex items-start gap-3"><span className="text-primary">•</span> Enterprise controls and analytics</li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <Link href="/v2/login">
                <Button size="lg">Start free trial</Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost">Contact sales</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-muted/5 p-6">
            <div className="text-sm text-muted-foreground">Get started — no credit card required</div>
            <form className="mt-4 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                aria-label="Email address"
                type="email"
                placeholder="you@company.com"
                required
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button type="submit">Request invite</Button>
            </form>

            <div className="mt-4 text-xs text-muted-foreground">We’ll only use your email to set up your trial and send important updates.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
