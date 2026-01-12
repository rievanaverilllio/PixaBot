"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";
import { Clock, Zap, Activity, Layers } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Hero */}
        <section className="mb-12 rounded-lg p-10 bg-gradient-to-r from-indigo-50 to-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold">Make work flow — automate the busywork</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                PixaBot turns conversations and documents into actions. Summarize meetings, extract tasks, and wire automations to reduce manual follow-ups.
              </p>

              <div className="mt-6 flex gap-3">
                <a href="/v2/login" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Try demo</a>
                <a href="/docs" className="px-4 py-2 rounded-md border">Docs</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-indigo-100 p-2"><Clock className="size-5 text-indigo-600" /></div>
                  <div>
                    <div className="font-semibold">Meeting summaries</div>
                    <div className="text-sm text-muted-foreground mt-1">One-click notes and decisions from calls.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-amber-100 p-2"><Zap className="size-5 text-amber-500" /></div>
                  <div>
                    <div className="font-semibold">Task extraction</div>
                    <div className="text-sm text-muted-foreground mt-1">Automatically detect and assign actions from chat.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-green-100 p-2"><Activity className="size-5 text-green-600" /></div>
                  <div>
                    <div className="font-semibold">Workflow triggers</div>
                    <div className="text-sm text-muted-foreground mt-1">Trigger pipelines from extracted events.</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-muted/20 p-2"><Layers className="size-5 text-muted-foreground" /></div>
                  <div>
                    <div className="font-semibold">Cross-tool sync</div>
                    <div className="text-sm text-muted-foreground mt-1">Integrate with trackers and chat platforms.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Common productivity flows</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-lg border bg-card">
              <div className="font-semibold">Meeting → Notes → Tasks</div>
              <div className="text-sm text-muted-foreground mt-2">Upload meeting transcript and get a short summary plus action items that can be pushed to your task tracker.</div>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="font-semibold">Inbox triage</div>
              <div className="text-sm text-muted-foreground mt-2">Auto-classify incoming messages and surface high-priority items to the right team members.</div>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="font-semibold">Document Q&A</div>
              <div className="text-sm text-muted-foreground mt-2">Ask questions about internal docs and get precise answers with source links.</div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Examples</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-lg border bg-gradient-to-b from-white/3 to-transparent">
              <div className="font-semibold">Meeting summary</div>
              <div className="mt-2 p-3 rounded bg-muted/10 text-sm whitespace-pre-wrap break-words">
                <div>Summary: Discussed rollout plan. Action: QA to produce test matrix by Fri.</div>
                <div className="mt-2"><strong>Decisions:</strong> Launch window confirmed for Q2.</div>
                <div><strong>Owner:</strong> Product & QA.</div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-gradient-to-b from-white/3 to-transparent">
              <div className="font-semibold">Extracted tasks</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                <li>Assign follow-up to engineering — investigate bug #432</li>
                <li>Prepare customer-facing FAQ</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded border bg-card">
              <div className="font-semibold">Slack & Teams</div>
              <div className="text-sm text-muted-foreground mt-1">Receive summaries and action items directly in channels.</div>
            </div>
            <div className="p-4 rounded border bg-card">
              <div className="font-semibold">Jira / Asana</div>
              <div className="text-sm text-muted-foreground mt-1">Create tasks automatically from extracted actions.</div>
            </div>
            <div className="p-4 rounded border bg-card">
              <div className="font-semibold">Notion / Confluence</div>
              <div className="text-sm text-muted-foreground mt-1">Push summaries and citations to your knowledge base.</div>
            </div>
          </div>
        </section>

        {/* Small CTA removed per request */}
      </main>

      <Footer />
    </div>
  );
}
