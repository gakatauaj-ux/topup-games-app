# Deployment Guide

## Langkah 1: Setup Supabase Database

1. Buka [supabase.com](https://supabase.com) dan buat akun/login
2. Klik "New Project"
3. Isi:
   - **Name**: `topup-games-db`
   - **Database Password**: Buat password kuat (simpan!)
   - **Region**: Pilih region terdekat (Singapore untuk Indonesia)
4. Tunggu project selesai dibuat (1-2 menit)
5. Masuk ke menu "Project Settings" > "Database"
6. Copy **Connection String** di bagian "URI"
7. Ganti `[YOUR-PASSWORD]` dengan password database Anda

## Langkah 2: Push ke GitHub

```bash
# Buat repository baru di GitHub
# Lalu jalankan:
git remote add origin https://github.com/YOUR_USERNAME/topup-games-app.git
git push -u origin main
```

## Langkah 3: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan GitHub
2. Klik "Add New Project"
3. Import repository `topup-games-app` dari GitHub
4. Pada "Configure Project", klik "Environment Variables" dan tambahkan:

```
DATABASE_URL=postgresql://postgres:[password]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
NEXTAUTH_URL=https://[your-project-name].vercel.app
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

5. Klik "Deploy"
6. Tunggu deployment selesai (2-3 menit)

## Langkah 4: Setup Database

Setelah deploy berhasil:

1. Buka Vercel Dashboard > Project > "Storage" tab
2. Atau jalankan migration manual via Vercel CLI:

```bash
vercel --version
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## Langkah 5: Setup Midtrans (Production)

1. Daftar di [midtrans.com](https://midtrans.com)
2. Dapatkan Server Key dan Client Key Production
3. Update environment variables di Vercel:
   - `MIDTRANS_IS_PRODUCTION=true`
   - `MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxxxxx`
   - `MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxxx`
4. Tambahkan domain Vercel ke Midtrans Dashboard > Settings > Payment Notification URL:
   - `https://[your-project-name].vercel.app/api/payment/notification`

## Akun Demo

Setelah deployment:
- **Admin**: admin@topup.com / admin123
- **User**: user@example.com / user123

## Troubleshooting

### Error: "Unable to connect to database"
- Pastikan DATABASE_URL benar
- Pastikan tidak ada typo di password
- Pastikan Supabase project sudah aktif

### Error: "Build failed"
- Cek logs di Vercel Dashboard
- Pastikan semua environment variables sudah diisi
- Jalankan `npm run build` secara lokal untuk cek error

### Migration Error
```bash
npx prisma migrate resolve --applied 20260216174512_init
npx prisma migrate deploy
```
