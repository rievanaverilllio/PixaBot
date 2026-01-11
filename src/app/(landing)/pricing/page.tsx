"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Pricing from "@/app/(landing)/_components/section/Pricing";
import Footer from "@/app/(landing)/_components/section/Footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Simple pricing for any team</h1>
          <p className="mt-4 text-muted-foreground">Plans that scale with your usage and needs — predictable billing, enterprise controls, and flexible seats or usage tiers.</p>
        </div>

        <div className="mt-10">
          <Pricing />
        </div>

        <section className="mt-12 max-w-4xl mx-auto text-sm text-muted-foreground">
          <h3 className="font-semibold">Compare plans</h3>
          <p className="mt-2">All plans include core messaging, image generation, role-based access, audit logs, and community support. Enterprise plans add SSO, dedicated support, and custom SLAs.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="p-4 border rounded-md">
              <div className="font-semibold">Monthly billing</div>
              <div className="mt-2">Pay-as-you-go with usage tiers and volume discounts.</div>
            </div>

            <div className="p-4 border rounded-md">
              <div className="font-semibold">Enterprise agreements</div>
              <div className="mt-2">Contact sales for custom contracts, SSO, and enhanced SLAs.</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
