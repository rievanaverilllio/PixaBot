import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function PrivacyPage() {
  const updated = new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Kami berkomitmen melindungi data pribadi Anda. Dokumen berikut menjelaskan praktik kami
              terkait pengumpulan, penggunaan, penyimpanan, dan hak Anda.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge>Terakhir diperbarui</Badge>
              <div className="text-sm text-muted-foreground">{updated}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/help">
              <Button variant="ghost">Hubungi Dukungan</Button>
            </Link>
            <Button asChild>
              <a href="/privacy.pdf" target="_blank" rel="noreferrer">Unduh PDF</a>
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">Ringkasan Singkat</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Kami mengumpulkan data yang diperlukan untuk menjalankan layanan, memproses pembayaran,
                  dan meningkatkan pengalaman pengguna. Kami menerapkan langkah-langkah keamanan teknis
                  dan kebijakan internal untuk menjaga data tetap aman.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Prinsip Utama</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Minimisasi data—kami hanya mengumpulkan yang diperlukan.</li>
                  <li>Transparansi—informasi penggunaan jelas dan dapat diakses.</li>
                  <li>Kontrol pengguna—Anda dapat meminta akses, perbaikan, atau penghapusan data.</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">Detail Kebijakan</h3>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium">Data yang Dikumpulkan</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Informasi yang Anda berikan secara langsung (contoh: nama, alamat email, data
                    pembayaran), serta data teknis otomatis (contoh: log akses, metrik penggunaan,
                    alamat IP) yang membantu kami menjaga dan memperbaiki layanan.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Tujuan Penggunaan</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Data digunakan untuk menyediakan layanan, memproses transaksi, mengirim notifikasi
                    penting, dan menganalisis peningkatan produk. Data agregat dapat digunakan untuk
                    analitik internal.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">FAQ & Hak Pengguna</h3>
              <Accordion type="single" collapsible>
                <AccordionItem value="access">
                  <AccordionTrigger>Bagaimana cara saya meminta akses ke data saya?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Kirim permintaan melalui halaman Bantuan atau hubungi tim dukungan kami. Kami akan
                      memverifikasi identitas Anda sebelum memenuhi permintaan akses.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delete">
                  <AccordionTrigger>Bisakah saya meminta penghapusan data?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Ya — Anda dapat meminta penghapusan data pribadi. Beberapa data yang diperlukan
                      untuk kepatuhan atau audit mungkin disimpan secara terbatas sesuai hukum yang
                      berlaku.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sharing">
                  <AccordionTrigger>Apakah data saya dibagikan ke pihak ketiga?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Kami tidak menjual data pribadi. Data dapat dibagikan dengan penyedia layanan
                      tepercaya (mis. pemroses pembayaran, layanan hosting) saat diperlukan untuk
                      operasional.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="flex justify-end">
              <Link href="/help">
                <Button variant="outline">Butuh Bantuan?</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
