"use client";

import { Mail, BookOpen, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "Bagaimana cara membeli token?", a: "Buka halaman Beli Token, pilih paket, lalu lakukan pembayaran melalui metode yang tersedia." },
  { q: "Bagaimana cara melihat riwayat penggunaan?", a: "Kunjungi halaman Riwayat & Tagihan untuk melihat log, detail penggunaan, dan mengunduh invoice." },
  { q: "Apakah ada batasan penggunaan API?", a: "Setiap API key dapat memiliki kuota atau batas per menit; cek detail pada halaman API & Kunci." },
];

const prompts = [
  "Buat ringkasan 3 poin dari teks berikut:",
  "Buat gambar gaya ilustrasi berdasarkan prompt:",
  "Tolong ubah tulisan ini ke bahasa Inggris:",
];

const curlExample = `curl -X POST "https://api.example.com/v1/generate" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"mistral-large","input":"Buat deskripsi produk singkat untuk layanan pengiriman"}'`;

export default function HelpPage() {
  return (
    <div className="p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BookOpen className="h-7 w-7 text-primary" />
                <div>
                  <CardTitle className="!text-2xl">Bantuan & Dokumentasi</CardTitle>
                  <p className="text-sm text-muted-foreground">Panduan lengkap, contoh penggunaan API, prompt terbaik, dan solusi cepat.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/buy-token">
                  <Button>Beli Token</Button>
                </Link>
                <Link href="/api-keys">
                  <Button variant="outline">API & Kunci</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <nav className="flex gap-4 text-sm">
              <a href="#getting-started" className="text-primary hover:underline">Getting Started</a>
              <a href="#guides" className="text-primary hover:underline">Guides</a>
              <a href="#api" className="text-primary hover:underline">API Examples</a>
              <a href="#best-practices" className="text-primary hover:underline">Best Practices</a>
              <a href="#troubleshooting" className="text-primary hover:underline">Troubleshooting</a>
              <a href="#support" className="text-primary hover:underline">Support</a>
            </nav>

            <section id="getting-started" className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="text-lg font-semibold">Langkah cepat</h4>
                <ol className="mt-3 space-y-3 list-decimal list-inside text-sm">
                  <li>Pendaftaran & verifikasi akun.</li>
                  <li>Beli token di halaman <Link href="/dashboard/buy-token" className="text-primary hover:underline">Beli Token</Link>.</li>
                  <li>Top-up / kelola metode pembayaran di <Link href="/payments" className="text-primary hover:underline">Pembayaran</Link>.</li>
                  <li>Gunakan chat di halaman utama untuk berinteraksi dengan model.</li>
                  <li>Gunakan API key di <Link href="/api-keys" className="text-primary hover:underline">API & Kunci</Link> untuk integrasi.</li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Panduan singkat Chat</h4>
                <div className="mt-3 text-sm space-y-2">
                  <p>Gunakan chat untuk melakukan tanya jawab, ringkasan, atau pembuatan teks. Tambahkan konteks singkat dan contoh output agar respons lebih relevan.</p>
                  <ul className="list-disc list-inside">
                    <li>Jelaskan gaya yang diinginkan (formal, santai, teknis).</li>
                    <li>Berikan batasan panjang hasil jika perlu.</li>
                    <li>Gunakan sistem prompt di server untuk preferensi global.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Panduan singkat Image</h4>
                <div className="mt-3 text-sm space-y-2">
                  <p>Gunakan tool <strong>Generate image</strong> dari antarmuka chat untuk membuat gambar berbasis prompt.</p>
                  <ul className="list-disc list-inside">
                    <li>Jelaskan objek, gaya seni, warna dominan, dan komposisi singkat.</li>
                    <li>Contoh: <span className="italic">"Ilustrasi vektor seorang kurir dalam gaya flat design, warna biru dan oranye"</span>.</li>
                    <li>Tunggu placeholder loading yang muncul sementara gambar dibuat.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="guides">
              <h4 className="text-lg font-semibold">Panduan Lengkap</h4>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrasi Chat (Client)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Contoh alur singkat: kirim pesan → server memanggil model → terima respons. Pastikan header Authorization terisi.</p>
                    <ul className="mt-2 text-sm list-disc list-inside">
                      <li>Simpan API key aman di server (ENV).</li>
                      <li>Terapkan rate limit dan sanitasi input.</li>
                      <li>Gunakan pesan sistem untuk preferensi output.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Integrasi Image (Server Proxy)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Gunakan endpoint image proxy untuk menyembunyikan API key dan mengelola ukuran/format respons.</p>
                    <p className="text-sm mt-2">Tampilkan placeholder pada UI sampai gambar tersedia, lalu render gambar atau tautan fallback jika gagal.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="api" className="mt-4">
              <h4 className="text-lg font-semibold">Contoh API</h4>
              <div className="mt-3">
                <p className="text-sm">Contoh permintaan sederhana menggunakan curl:</p>
                <pre className="mt-2 bg-muted/10 p-3 rounded text-sm whitespace-pre-wrap break-words max-w-full">
{curlExample}
                </pre>
                <p className="mt-2 text-xs text-muted-foreground">Ganti <code>$API_KEY</code> dengan kunci Anda. Lihat halaman <Link href="/api-keys" className="text-primary hover:underline">API & Kunci</Link> untuk cara membuat kunci.</p>
              </div>
            </section>

            <section id="best-practices" className="mt-4">
              <h4 className="text-lg font-semibold">Best Practices & Prompting</h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <h5 className="font-medium">Prompting</h5>
                  <ul className="list-inside list-disc mt-2">
                    <li>Jelaskan konteks singkat (tujuan, audiens).</li>
                    <li>Berikan contoh output jika menginginkan format khusus.</li>
                    <li>Batasi keluaran jika perlu (mis. "maks 3 poin").</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Keamanan & Kebijakan</h5>
                  <ul className="list-inside list-disc mt-2">
                    <li>Jangan kirim data sensitif melalui prompt.</li>
                    <li>Sanitasi input pengguna untuk menghindari injeksi.</li>
                    <li>Ikuti kebijakan konten yang berlaku untuk model yang digunakan.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="troubleshooting" className="mt-4">
              <h4 className="text-lg font-semibold">Troubleshooting</h4>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <div className="font-medium">Gagal membuat gambar</div>
                  <div className="text-muted-foreground">Periksa log server, kuota API, dan format prompt. Jika ada error, periksa juga endpoint proxy.</div>
                </div>
                <div>
                  <div className="font-medium">Respons model tidak relevan</div>
                  <div className="text-muted-foreground">Tambahkan instruksi yang lebih spesifik pada prompt atau gunakan pesan sistem untuk preferensi global.</div>
                </div>
                <div>
                  <div className="font-medium">Masalah pembayaran</div>
                  <div className="text-muted-foreground">Periksa status pembayaran di <Link href="/payments" className="text-primary hover:underline">Pembayaran</Link> atau hubungi tim support.</div>
                </div>
              </div>
            </section>

            <section id="support" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LifeBuoy className="h-5 w-5" />
                      <CardTitle>Hubungi Support</CardTitle>
                    </div>
                    <div className="text-sm text-muted-foreground">Senin–Jumat, 09:00–17:00</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm">Email dukungan: <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a></p>
                      <p className="text-sm">Untuk masalah mendesak, sertakan: screenshot, langkah reproduksi, dan ID pengguna Anda.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href="mailto:support@example.com">
                        <Button variant="outline">Kirim Email</Button>
                      </Link>
                      <Link href="/contact">
                        <Button>Form Kontak</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
