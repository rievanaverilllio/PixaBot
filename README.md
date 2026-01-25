**PixaBot — Admin / Dashboard**

Ringkasan singkat:
- Aplikasi admin/dashboard berbasis Next.js yang menggunakan Prisma + MySQL untuk penyimpanan data.
- Menyertakan model untuk user, pembayaran, token, chat, dan image generation.

Persyaratan
- Node.js (LTS), npm
- MySQL server (atau kompatibel)

Setup lokal
1. Salin contoh environment atau buat file `.env` di root proyek dan set `DATABASE_URL`:

```bash
DATABASE_URL="mysql://DB_USER:DB_PASS@localhost:3306/pixabot_db"
```

2. Instal dependensi:

```bash
npm install
```

3. (Rekomendasi) Generate Prisma client:

```bash
npx prisma generate
```

Database: migrasi & seed
- Skema Prisma ada di `prisma/schema.prisma` (provider = "mysql").
- Skrip seed ditentukan di `prisma/seed.js` dan juga di `package.json` sebagai `npm run db:seed`.

Perintah umum:

```bash
# Terapkan migrasi (production / deploy)
npx prisma migrate deploy

# Untuk development (membuat/menjalankan migration lokal)
npx prisma migrate dev

# Reset database (akan menghapus data) dan jalankan seed
npx prisma migrate reset --force

# Jalankan seed secara eksplisit (sesuai konfigurasi di package.json)
npm run db:seed

# Atau jalankan seed script langsung
node prisma/seed.js

# Buka Prisma Studio untuk inspeksi data
npx prisma studio
```

Perintah npm yang sering dipakai
- `npm run dev` — jalankan Next.js di mode development
- `npm run build` — build produksi
- `npm run start` — jalankan server Next.js hasil build
- `npm run db:seed` — jalankan seed (tergantung `prisma.seed` di package.json)

Lokasi penting
- `prisma/schema.prisma` — definisi model & datasource
- `prisma/seed.js` — skrip seed (menggunakan `@prisma/client`, bcryptjs, crypto)
- `src/` — kode aplikasi Next.js (app, components, lib, dsb.)

Catatan
- Pastikan `DATABASE_URL` benar dan MySQL dapat diakses sebelum menjalankan migrasi/seed.
- `prisma migrate reset` akan menghapus semua data — jangan jalankan pada production.
- Jika butuh saya jalankan migrasi + seed di environment Anda sekarang, beri tahu dan sediakan akses `DATABASE_URL` (atau buat `.env`).

Contributing
- Ikuti konvensi di repo; gunakan `biome` untuk lint/format sesuai `package.json`.

Lisensi
- Lihat file `LICENSE` untuk detail lisensi.

