"use client";

import Topbar from "@/app/(landing)/_components/section/Topbar";
import Footer from "@/app/(landing)/_components/section/Footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Topbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-transparent p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold">We build delightful AI experiences for real products</h1>
            <p className="mt-4 text-muted-foreground text-lg">Production-grade conversational tooling and visual AI — trusted by engineering teams and designed for scale.</p>

            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">99.95%</div>
                <div className="text-sm text-muted-foreground">Avg uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-sm text-muted-foreground">Messages/day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border">
            <h3 className="font-semibold">Our story</h3>
            <p className="mt-2 text-sm text-muted-foreground">Founded by engineers building chat and graphics pipelines, PixaBot focuses on reliability and developer experience.</p>
          </div>
          <div className="p-6 rounded-lg border">
            <h3 className="font-semibold">What we value</h3>
            <ul className="mt-2 text-sm text-muted-foreground list-inside list-disc space-y-1">
              <li>Ship with quality</li>
              <li>Design for privacy</li>
              <li>Make integration trivial</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg border">
            <h3 className="font-semibold">How we work</h3>
            <p className="mt-2 text-sm text-muted-foreground">Cross-functional teams, API-first design, and close collaboration with customers during integrations.</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-center">Timeline</h2>
          <div className="mt-6 flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex-1 p-4 border rounded-lg text-center">
              <div className="font-medium">2021</div>
              <div className="text-sm text-muted-foreground mt-1">Founding & early R&D</div>
            </div>
            <div className="flex-1 p-4 border rounded-lg text-center">
              <div className="font-medium">2022</div>
              <div className="text-sm text-muted-foreground mt-1">Beta partners and SDKs</div>
            </div>
            <div className="flex-1 p-4 border rounded-lg text-center">
              <div className="font-medium">2024</div>
              <div className="text-sm text-muted-foreground mt-1">Production release & enterprise features</div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-center">Team</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 text-center border rounded-lg">
              <div className="h-20 w-20 mx-auto rounded-full bg-muted" />
              <div className="mt-3 font-semibold">Alex Rivera</div>
              <div className="text-sm text-muted-foreground">CEO</div>
            </div>
            <div className="p-4 text-center border rounded-lg">
              <div className="h-20 w-20 mx-auto rounded-full bg-muted" />
              <div className="mt-3 font-semibold">Priya Sharma</div>
              <div className="text-sm text-muted-foreground">CTO</div>
            </div>
            <div className="p-4 text-center border rounded-lg">
              <div className="h-20 w-20 mx-auto rounded-full bg-muted" />
              <div className="mt-3 font-semibold">Jordan Lee</div>
              <div className="text-sm text-muted-foreground">Head of Product</div>
            </div>
          </div>
        </section>

        <section className="mt-12 p-6 rounded-lg bg-gradient-to-r from-primary/5 to-transparent text-center">
          <h3 className="text-lg font-semibold">Join us</h3>
          <p className="mt-2 text-sm text-muted-foreground">We're hiring engineers, designers, and customer champions. careers@pixabot.com</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
