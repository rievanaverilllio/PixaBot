"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Contact us</h1>
          <p className="mt-3 text-muted-foreground">Questions about PixaBot, enterprise plans, or technical integrations — we're here to help.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Send us a message</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fill out the form and our team will respond within one business day.</p>

            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Form submission not implemented in this demo.'); }}>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input required className="mt-1 w-full rounded border px-3 py-2" placeholder="Your name" />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" required className="mt-1 w-full rounded border px-3 py-2" placeholder="you@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea required className="mt-1 w-full rounded border px-3 py-2 h-32" placeholder="How can we help?" />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit">Send message</Button>
              </div>
            </form>
          </section>

          <aside className="p-6 border rounded-lg space-y-4">
            <div>
              <h4 className="font-semibold">Support</h4>
              <p className="text-sm text-muted-foreground mt-1">support@pixabot.com — Response time: ~1 business day (priority support for enterprise customers)</p>
            </div>

            <div>
              <h4 className="font-semibold">Sales</h4>
              <p className="text-sm text-muted-foreground mt-1">sales@pixabot.com — For pricing, custom contracts, and enterprise onboarding.</p>
            </div>

            <div>
              <h4 className="font-semibold">Security & privacy</h4>
              <p className="text-sm text-muted-foreground mt-1">security@pixabot.com — Report incidents or ask about compliance and data handling.</p>
            </div>

            <div>
              <h4 className="font-semibold">Office</h4>
              <p className="text-sm text-muted-foreground mt-1">PixaBot, 123 Innovation Drive, Suite 400, City, Country</p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Hours</h4>
              <p className="text-sm text-muted-foreground mt-1">Mon–Fri, 9:00–17:00 (local time)</p>
            </div>
          </aside>
        </div>

        <section className="mt-10 p-6 bg-muted/10 rounded-lg">
          <h4 className="font-semibold">Need immediate assistance?</h4>
          <p className="text-sm text-muted-foreground mt-2">If you have an incident affecting production, include account ID and timestamps in your message and use the security email for priority handling.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
