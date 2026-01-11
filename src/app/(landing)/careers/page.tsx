"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold">Careers at PixaBot</h1>
          <p className="mt-3 text-muted-foreground">Join a team building production-grade conversational and visual AI tools used by product teams worldwide.</p>
        </div>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">Open roles</h3>
            <p className="mt-2 text-sm text-muted-foreground">We hire across engineering, product, design, and customer-facing roles. Below are a few highlighted openings.</p>

            <div className="mt-4 space-y-4">
              <article className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Senior Backend Engineer</div>
                    <div className="text-sm text-muted-foreground">Distributed systems · API design · Go/TypeScript</div>
                  </div>
                  <div>
                    <a href="#apply" className="text-sm text-primary">Apply</a>
                  </div>
                </div>
              </article>

              <article className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Product Designer</div>
                    <div className="text-sm text-muted-foreground">Design systems · UX for developer tools</div>
                  </div>
                  <div>
                    <a href="#apply" className="text-sm text-primary">Apply</a>
                  </div>
                </div>
              </article>

              <article className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Customer Success Manager</div>
                    <div className="text-sm text-muted-foreground">Enterprise onboarding & integrations</div>
                  </div>
                  <div>
                    <a href="#apply" className="text-sm text-primary">Apply</a>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <aside className="p-6 border rounded-lg">
            <h3 className="font-semibold">Why work with us</h3>
            <ul className="mt-3 text-sm text-muted-foreground list-inside list-disc space-y-2">
              <li>Competitive compensation and equity</li>
              <li>Flexible remote-first policy and generous PTO</li>
              <li>Comprehensive health & wellness benefits</li>
              <li>Learning stipend and conference budget</li>
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold">Hiring process</h4>
              <ol className="mt-2 text-sm text-muted-foreground list-decimal list-inside space-y-2">
                <li>Intro call with Talent</li>
                <li>Technical interview / portfolio review</li>
                <li>Practical assignment or system design</li>
                <li>Final interview with leadership</li>
              </ol>
            </div>
          </aside>
        </section>

        <section id="apply" className="mt-10 p-6 bg-muted/10 rounded-lg">
          <h3 className="font-semibold">How to apply</h3>
          <p className="mt-2 text-sm text-muted-foreground">Send your resume, a short note about what excites you, and links to relevant work to careers@pixabot.com. If you prefer referrals, include the referrer's name.</p>

          <div className="mt-4 flex gap-3">
            <Button onClick={() => window.location.href = 'mailto:careers@pixabot.com'}>Email Careers</Button>
            <a className="inline-flex items-center px-4 py-2 rounded border text-sm" href="#">View all roles</a>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="font-semibold">Equal opportunity</h3>
          <p className="mt-2 text-sm text-muted-foreground">PixaBot is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
