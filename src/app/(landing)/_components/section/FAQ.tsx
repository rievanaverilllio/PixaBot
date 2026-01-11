"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    { q: "How do I integrate PixaBot?", a: "Use our REST API or official SDKs. See quickstart guides for Node and Python; integration takes minutes." },
    { q: "Is my data stored?", a: "We retain minimal metadata by default. Enterprise customers can enable opt-out, residency controls, and retention policies." },
    { q: "Can I host privately?", a: "Yes — contact sales for private cloud or on-prem options with custom SLAs and compliance support." },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">Answers to common questions about integration, security, and billing.</p>

        <div className="mt-6">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground">{f.a}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
