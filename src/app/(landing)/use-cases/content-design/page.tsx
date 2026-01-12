"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";
import { Image as ImageIcon, Layers, Palette, Camera, Grid } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Hero */}
        <section className="mb-12 rounded-lg p-10 bg-gradient-to-r from-amber-50 to-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold">Content & design at production scale</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                From marketing assets to product mockups, PixaBot helps designers and content teams generate consistent, on-brand visuals programmatically — fast.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="/v2/login" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Try demo</a>
                <a href="/docs" className="px-4 py-2 rounded-md border">Docs</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-amber-100 p-2"><Palette className="size-5 text-amber-600" /></div>
                  <div>
                    <div className="font-semibold">On-brand variants</div>
                    <div className="text-sm text-muted-foreground mt-1">Specify brand tokens and generate consistent variants.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2"><Layers className="size-5 text-primary" /></div>
                  <div>
                    <div className="font-semibold">Mockup automation</div>
                    <div className="text-sm text-muted-foreground mt-1">Programmatically create layout variations for testing.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-muted/20 p-2"><Camera className="size-5 text-muted-foreground" /></div>
                  <div>
                    <div className="font-semibold">Image pipelines</div>
                    <div className="text-sm text-muted-foreground mt-1">Transform, resize, and export assets with metadata.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-muted/20 p-2"><Grid className="size-5 text-muted-foreground" /></div>
                  <div>
                    <div className="font-semibold">A/B creative testing</div>
                    <div className="text-sm text-muted-foreground mt-1">Quickly generate and preview test variants.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Gallery — generated samples</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-lg bg-gradient-to-br from-muted/10 to-muted/5 flex items-center justify-center border">
                <div className="text-sm text-muted-foreground">Sample image {i + 1}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Workflows */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Designer workflows</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold">Prompt-driven assets</h3>
              <p className="mt-2 text-sm text-muted-foreground">Teams use PixaBot to turn brief creative directions into layout-ready assets. Include brand colors, tone, and composition hints in the prompt.</p>
              <pre className="mt-3 p-3 rounded bg-muted/10 text-sm overflow-auto">{`Prompt: "Marketing banner, product hero, brand colors: #FF6A00, #0A2540, include CTA"`}</pre>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold">Batch variant generation</h3>
              <p className="mt-2 text-sm text-muted-foreground">Generate dozens of variants with different copy, image crops, and sizes for channels like social and email.</p>
            </div>
          </div>
        </section>

        {/* Integration notes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Integration & export</h2>
          <p className="text-sm text-muted-foreground">Export generated assets with JSON metadata for automated pipelines or connect PixaBot directly to your CMS and asset manager.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded border bg-card">
              <div className="font-semibold">Formats</div>
              <div className="text-sm text-muted-foreground mt-1">PNG, JPG, WebP, and data URLs for direct rendering.</div>
            </div>
            <div className="p-4 rounded border bg-card">
              <div className="font-semibold">Metadata</div>
              <div className="text-sm text-muted-foreground mt-1">Prompt, seed, and variant labels included for reproduction.</div>
            </div>
            <div className="p-4 rounded border bg-card">
              <div className="font-semibold">Delivery</div>
              <div className="text-sm text-muted-foreground mt-1">Direct download, upload to CDN, or push to your asset service.</div>
            </div>
          </div>
        </section>

        {/* CTA removed per request */}
      </main>

      <Footer />
    </div>
  );
}
