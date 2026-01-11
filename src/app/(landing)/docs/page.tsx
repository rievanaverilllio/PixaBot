"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Documentation</h1>
          <p className="mt-4 text-muted-foreground">Guides, API reference, SDKs, and examples to help you build with PixaBot.</p>
        </div>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">Quickstart — 5 minutes</h3>
            <ol className="mt-3 text-sm text-muted-foreground list-decimal list-inside space-y-2">
              <li>Create a new project and install the SDK for your platform.</li>
              <li>Provision an API key in the dashboard and store it securely (env var / secret store).</li>
              <li>Initialize the client and make your first request to start a conversation or generate an image.</li>
              <li>Handle webhooks for async responses and persist conversation state.</li>
              <li>Apply rate limit handling and implement retry/backoff for production usage.</li>
            </ol>

            <div className="mt-4 text-sm">
              <div className="font-medium">Example (fetch):</div>
              <pre className="mt-2 bg-surface p-3 rounded text-sm overflow-auto"><code>{`fetch('/api/pixabot/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({ message: 'Generate a product thumbnail for SKU-123' })
})
  .then(r => r.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));`}</code></pre>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">API Reference — Overview</h3>
            <p className="mt-2 text-sm text-muted-foreground">Our REST API provides endpoints for conversations, images, users, and billing. Authentication uses Bearer tokens (API keys). Responses follow a consistent schema with status, data, and error fields.</p>

            <div className="mt-3 text-sm space-y-2">
              <div><strong>Endpoints:</strong> /v1/conversations, /v1/images, /v1/webhooks, /v1/keys</div>
              <div><strong>Auth:</strong> Bearer API key with scoped permissions.</div>
              <div><strong>Rate limits:</strong> Tier-based; implement exponential backoff on 429 responses.</div>
              <div><strong>Errors:</strong> Standardized error codes with human-readable messages and machine-friendly codes.</div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">SDKs & CLI</h3>
            <p className="mt-2 text-sm text-muted-foreground">Official SDKs provide typed clients, batching helpers, and streaming helpers for realtime messaging.</p>

            <div className="mt-3 text-sm">
              <div className="font-medium">JavaScript</div>
              <div className="mt-1">Install: <span className="font-mono">npm install @pixabot/sdk</span></div>
              <div className="mt-2">Example init: <span className="font-mono">{`const client = new Pixabot({ apiKey: process.env.PIXABOT_KEY })`}</span></div>
            </div>

            <div className="mt-3 text-sm">
              <div className="font-medium">Python</div>
              <div className="mt-1">Install: <span className="font-mono">pip install pixabot</span></div>
              <div className="mt-2">Example init: <span className="font-mono">{`client = Pixabot(api_key=os.environ['PIXABOT_KEY'])`}</span></div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">Guides & Best Practices</h3>
            <div className="mt-3 text-sm text-muted-foreground space-y-2">
              <div><strong>Security:</strong> Use scoped API keys, rotate keys regularly, and enable audit logs.</div>
              <div><strong>Webhooks:</strong> Verify signatures, respond with 200 quickly, and queue heavy work.</div>
              <div><strong>Scaling:</strong> Use batching for high-throughput image generation and prefer async webhooks for long-running tasks.</div>
              <div><strong>Costs:</strong> Monitor usage; set alerts for spend thresholds and use caching where possible.</div>
            </div>
          </div>
        </section>

        <section className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <aside className="p-6 border rounded-lg bg-muted/5">
            <h3 className="text-lg font-semibold">Frequently asked questions</h3>
            <p className="mt-2 text-sm text-muted-foreground">Short, practical answers to the most common developer and admin questions.</p>

            <div className="mt-4 space-y-3">
              <details className="bg-background p-3 rounded">
                <summary className="cursor-pointer font-medium">How do I get an API key?</summary>
                <div className="mt-2 text-sm text-muted-foreground">Create an account, go to the API keys section in the dashboard, and generate a key. Store keys in environment variables and apply least-privilege scopes for production.</div>
              </details>

              <details className="bg-background p-3 rounded">
                <summary className="cursor-pointer font-medium">Can I self-host PixaBot?</summary>
                <div className="mt-2 text-sm text-muted-foreground">We provide on-prem and private cloud deployments for enterprise customers. These include deployment manifests, monitoring guidance, and optional managed upgrades.</div>
              </details>

              <details className="bg-background p-3 rounded">
                <summary className="cursor-pointer font-medium">What compliance certifications do you have?</summary>
                <div className="mt-2 text-sm text-muted-foreground">PixaBot adheres to SOC2 controls and GDPR requirements. We can provide a DPA and security questionnaire for enterprise procurement.</div>
              </details>
            </div>
          </aside>

          <aside className="p-6 border rounded-lg bg-gradient-to-r from-muted/10 to-transparent">
            <h3 className="text-lg font-semibold">Support & onboarding</h3>
            <p className="mt-2 text-sm text-muted-foreground">Structured onboarding and support plans for teams adopting PixaBot.</p>

            <ol className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">1</div>
                <div>
                  <div className="font-medium">Kickoff & architecture review</div>
                  <div className="text-muted-foreground">We review your use cases, recommend architecture, and plan the integration path.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">2</div>
                <div>
                  <div className="font-medium">Sandbox integration</div>
                  <div className="text-muted-foreground">Connect a sandbox instance, test webhooks, and validate workflows before production rollout.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">3</div>
                <div>
                  <div className="font-medium">Production launch & SLA</div>
                  <div className="text-muted-foreground">Enable monitoring, configure alerts, and activate the SLA/incident contact paths for your account.</div>
                </div>
              </li>
            </ol>

            <div className="mt-6 p-4 border rounded-md bg-background">
              <div className="font-semibold">Support options</div>
              <div className="mt-2 text-sm text-muted-foreground">Community support, paid priority support, and enterprise technical account management are available.</div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

