"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const quotes = [
    { name: "Acme Inc.", title: "Head of Product", text: "PixaBot reduced our support load by 40% and accelerated content creation across channels.", avatar: "/media/mock.png" },
    { name: "Bright Studio", title: "Creative Director", text: "Image generation integrated directly into our workflow — we shipped creative assets faster.", avatar: "/media/partner.png" },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold">What customers say</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">Success stories from teams that rely on PixaBot in production.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {quotes.map((q) => (
            <div key={q.name} className="rounded-lg bg-gradient-to-br from-muted/10 to-muted/5 p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-full overflow-hidden w-12 h-12 bg-muted/30 flex items-center justify-center">
                  {/* Avatar fallback or logo */}
                  <Image src={q.avatar} alt={q.name} width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{q.name}</div>
                    <div className="text-sm text-muted-foreground">{q.title}</div>
                  </div>
                  <div className="mt-3 text-lg italic">“{q.text}”</div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex gap-1 text-amber-400">
                      <Star className="h-4 w-4" />
                      <Star className="h-4 w-4" />
                      <Star className="h-4 w-4" />
                      <Star className="h-4 w-4" />
                      <Star className="h-4 w-4 opacity-60" />
                    </div>
                    <div className="text-sm text-muted-foreground">Rated highly for reliability and speed</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
