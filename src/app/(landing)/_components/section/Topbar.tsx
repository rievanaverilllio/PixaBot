"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/app/(landing)/_components/sidebar/theme-switcher";
import { LayoutControls } from "@/app/(landing)/_components/sidebar/layout-controls";

export default function Topbar() {
  return (
    <header className="border-b border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">
            PixaBot
          </Link>

          <nav className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="features" className="hover:underline">Features</Link>
            <Link href="pricing" className="hover:underline">Pricing</Link>
            <Link href="docs" className="hover:underline">Docs</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LayoutControls hideLayoutOptions />
          <ThemeSwitcher />

          <Link href="/privacy" className="text-sm text-muted-foreground hidden sm:inline">Privacy</Link>
          <Link href="/v2/login">
            <Button>Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
