"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="font-semibold text-lg">PixaBot</div>
          <div className="text-sm text-muted-foreground">Build smarter conversations and visuals — deployed at scale.</div>
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} PixaBot, Inc.</div>
        </div>

        <div>
          <div className="font-medium">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/docs">Docs</Link></li>
            <li><Link href="/v2/login">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="/about">About</a></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium">Stay informed</div>
          <p className="mt-2 text-sm text-muted-foreground">Get product updates and release notes.</p>
          <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input aria-label="Email" type="email" placeholder="you@company.com" required className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none" />
            <button className="rounded-md bg-primary px-3 py-2 text-sm text-white">Subscribe</button>
          </form>

          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="GitHub"><Github className="h-5 w-5" /></a>
            <a href="mailto:hello@pixabot.example" aria-label="Email"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
