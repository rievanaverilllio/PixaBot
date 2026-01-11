"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Privacy & Data Protection</h1>
          <p className="mt-4 text-muted-foreground">Clear, minimal, and practical — what we collect, why, and how you control it.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-sm font-semibold">What we collect</div>
            <div className="mt-2 text-muted-foreground text-sm">Account metadata, conversation content (if enabled), logs, and usage metrics.</div>
          </div>
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-sm font-semibold">Why we use it</div>
            <div className="mt-2 text-muted-foreground text-sm">To power chat, generate images, secure systems, and bill usage accurately.</div>
          </div>
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-sm font-semibold">How to control it</div>
            <div className="mt-2 text-muted-foreground text-sm">Dashboard controls for export, deletion, and API key management; admin-only actions for org data.</div>
          </div>
        </div>

        <section className="mt-8 space-y-4">
          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Data collection (what and when)</summary>
            <div className="mt-2 text-sm text-muted-foreground">We collect account setup details (email, org), incoming messages and attachments when conversations are used, telemetry for service health, and audit logs. We only store conversation content when required by the feature and according to your account settings.</div>
          </details>

          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Processing purposes (how we use data)</summary>
            <div className="mt-2 text-sm text-muted-foreground">Data powers message delivery, model inference, billing, fraud detection, and support. Aggregated, anonymized analytics are used to improve reliability and models; personal data is not sold.</div>
          </details>

          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Retention & deletion</summary>
            <div className="mt-2 text-sm text-muted-foreground">By default, conversation content is retained for X days (configurable per plan). Administrators can request deletion of organization data; we maintain limited logs/backups for security and legal obligations for a short period.</div>
          </details>

          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Security practices</summary>
            <div className="mt-2 text-sm text-muted-foreground">Encryption in transit and at rest, RBAC, regular pentests, and strict access policies. We rotate keys and audit access to production systems.</div>
          </details>

          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">User rights & portability</summary>
            <div className="mt-2 text-sm text-muted-foreground">Export your organization data as JSON/CSV. Request corrections or deletions through the dashboard or by contacting privacy@pixabot.com. Deletion requests are processed per our retention policy.</div>
          </details>

          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Third-party processors</summary>
            <div className="mt-2 text-sm text-muted-foreground">We use hosting, monitoring, and payments providers under data processing agreements and only share data strictly necessary for service delivery.</div>
          </details>
        </section>

        <section className="mt-8 p-6 bg-muted/10 rounded-lg">
          <h3 className="font-semibold">Need to act quickly?</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-3 bg-background rounded">
              <div className="font-medium">Export data</div>
              <div className="mt-1">Admins can export conversation and account data from the dashboard in minutes.</div>
            </div>
            <div className="p-3 bg-background rounded">
              <div className="font-medium">Request deletion</div>
              <div className="mt-1">Open a support ticket from your organization to request data deletion or narrowing of retention windows.</div>
            </div>
            <div className="p-3 bg-background rounded">
              <div className="font-medium">Security incidents</div>
              <div className="mt-1">Report incidents to security@pixabot.com; accounts with enterprise support receive priority response and dedicated incident handling.</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
