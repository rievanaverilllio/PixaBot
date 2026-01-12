"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";
import { Briefcase, MessageSquare, Shuffle, CheckCircle, Clock, Users } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Hero */}
        <section className="rounded-lg bg-gradient-to-r from-primary/8 to-transparent p-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold">Customer support that scales with you</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                Reduce response time and improve consistency across channels. PixaBot provides AI-powered reply suggestions, ticket summarization, intent detection, and visual assets for documentation — all integrated into your support stack.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/v2/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground shadow-sm">Try demo</a>
                <a href="/docs" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border">View docs</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-6 text-primary" />
                  <div>
                    <div className="font-semibold">Suggested replies</div>
                    <div className="text-sm text-muted-foreground">Real-time suggestions for faster agent responses.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border">
                <div className="flex items-center gap-3">
                  <Shuffle className="size-6 text-amber-500" />
                  <div>
                    <div className="font-semibold">Variant images</div>
                    <div className="text-sm text-muted-foreground">Generate illustrative assets for KB and replies.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-green-500" />
                  <div>
                    <div className="font-semibold">Action extraction</div>
                    <div className="text-sm text-muted-foreground">Automatically detect follow-ups and tasks.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border">
                <div className="flex items-center gap-3">
                  <Clock className="size-6 text-indigo-600" />
                  <div>
                    <div className="font-semibold">SLA monitoring</div>
                    <div className="text-sm text-muted-foreground">Keep response times in check with alerts.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What teams use PixaBot for</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-primary/10 p-2"><Briefcase className="size-5 text-primary" /></div>
                <div>
                  <div className="font-semibold">Assist agents</div>
                  <div className="text-sm text-muted-foreground mt-2">Show contextual reply suggestions, sentiment signals, and recommended knowledge base articles right inside the agent interface.</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-amber-100 p-2"><MessageSquare className="size-5 text-amber-500" /></div>
                <div>
                  <div className="font-semibold">Summarize threads</div>
                  <div className="text-sm text-muted-foreground mt-2">Auto-generate concise summaries and action items for long conversations to speed up handoffs.</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-indigo-100 p-2"><Users className="size-5 text-indigo-600" /></div>
                <div>
                  <div className="font-semibold">Triage & routing</div>
                  <div className="text-sm text-muted-foreground mt-2">Classify and route tickets automatically based on intent and urgency.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example workflows */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Example workflows</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-lg border bg-gradient-to-b from-white/3 to-transparent">
              <div className="font-semibold">Auto-suggest + one-click reply</div>
              <p className="mt-2 text-sm text-muted-foreground">When an agent opens a ticket, PixaBot suggests 3 reply variants. The agent can edit and send, reducing average reply time by up to 50%.</p>

              <pre className="mt-4 p-3 rounded bg-muted/10 text-sm overflow-auto">
{`// Example: fetch suggested replies
POST /api/pixachat
{ messages: [{ role: 'user', content: 'Customer: My app crashes on login' }] }
`}
              </pre>
            </div>

            <div className="p-6 rounded-lg border bg-gradient-to-b from-white/3 to-transparent">
              <div className="font-semibold">Summarize & extract actions</div>
              <p className="mt-2 text-sm text-muted-foreground">After a long thread, PixaBot outputs a short summary and a list of action items for the agent or product team.</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                <li>Summary: Repro steps, environment, error logs</li>
                <li>Action: Ask user for X, escalate to backend, attach logs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Metrics / Case study */}
        <section className="mb-12">
          <div className="rounded-lg p-6 bg-primary/6 border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-3xl font-bold">Reduce time to resolution</div>
                <div className="text-muted-foreground mt-1">Customers report 30-60% faster responses when using suggestion workflows.</div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-bold text-xl">30%</div>
                  <div className="text-sm text-muted-foreground">Reply time ↓</div>
                </div>
                <div>
                  <div className="font-bold text-xl">40%</div>
                  <div className="text-sm text-muted-foreground">Support cost ↓</div>
                </div>
                <div>
                  <div className="font-bold text-xl">95%</div>
                  <div className="text-sm text-muted-foreground">CSAT (avg)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA removed per request */}
      </main>

      <Footer />
    </div>
  );
}
