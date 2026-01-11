"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Features from "@/app/(landing)/_components/section/Features";
import Footer from "@/app/(landing)/_components/section/Footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Powerful features for builders</h1>
          <p className="mt-4 text-muted-foreground text-lg">PixaBot combines conversation, automation, and image generation in one platform designed for production usage — secure, extensible, and easy to integrate.</p>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="px-3 py-2 bg-muted rounded-md">SLA-ready</div>
            <div className="px-3 py-2 bg-muted rounded-md">Audit logs</div>
            <div className="px-3 py-2 bg-muted rounded-md">Enterprise SSO</div>
            <div className="px-3 py-2 bg-muted rounded-md">GDPR & SOC2</div>
          </div>
        </div>

        <div className="mt-12">
          <Features />
        </div>

        <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Real-time Conversations</h3>
            <p className="mt-2 text-sm text-muted-foreground">Low-latency messaging, routing, and context-aware replies for live customer support and assistants.</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Visual AI & Images</h3>
            <p className="mt-2 text-sm text-muted-foreground">Generate, edit, and understand images inside chat — from thumbnails to product mockups powered by PixaBot's pipelines.</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Automations & Workflows</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create triggers, handlers, and multi-step automations that connect to your systems and keep tasks flowing.</p>
          </div>
        </section>

        <section className="mt-12 bg-gradient-to-r from-muted/30 to-transparent p-6 rounded-lg">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold">Trusted at scale</h3>
              <p className="mt-2 text-sm text-muted-foreground">Deployed across production fleets with uptime guarantees, audited pipelines, and enterprise controls.</p>

              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <div className="text-2xl font-bold">99.95%</div>
                  <div className="text-muted-foreground">Average uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1M+</div>
                  <div className="text-muted-foreground">Messages / day</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">200+</div>
                  <div className="text-muted-foreground">Integrations</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="p-4 bg-background rounded-md text-sm">
                <div className="font-semibold">Integrations</div>
                <div className="mt-2 text-muted-foreground">Slack, Teams, REST APIs, Webhooks, Databases, and more — connect your stack in minutes.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center">For developers</h2>
          <p className="text-center mt-2 text-muted-foreground max-w-2xl mx-auto">Quick example: call the PixaBot API to start a conversation and receive a structured reply.</p>

          <div className="mt-6 max-w-3xl mx-auto">
            <pre className="bg-surface p-4 rounded-md overflow-auto text-sm"><code>{`// Example: start a conversation (fetch)
fetch('/api/pixabot/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({ message: 'Generate a product thumbnail for SKU-123' })
})
  .then(r => r.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
`}</code></pre>

            <div className="mt-4 text-sm text-muted-foreground">Official SDKs: JavaScript, Python, and CLI. Use API keys with fine-grained scopes for production apps.</div>
          </div>
        </section>

        
      </main>

      <Footer />
    </div>
  );
}
