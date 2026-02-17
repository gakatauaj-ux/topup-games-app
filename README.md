# 🎮 Topup Games App

Aplikasi top up game dengan fitur lengkap termasuk:
- Manajemen produk dan kategori game
- Sistem autentikasi (Login/Register)
- Pembayaran dengan Midtrans
- Dashboard admin
- Riwayat transaksi

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+
- Git
- Akun [Supabase](https://supabase.com)
- Akun [Vercel](https://vercel.com)
- Akun [Midtrans](https://midtrans.com) (optional, untuk pembayaran)

### Step 1: Setup Database (Supabase)

1. Login ke [Supabase](https://supabase.com)
2. Buat project baru:
   - **Name**: `topup-games`
   - **Password**: Buat password kuat (catat!)
   - **Region**: Singapore (terdekat dengan Indonesia)
3. Tunggu sampai project ready
4. Go to **Project Settings** > **Database**
5. Copy **Connection string** (URI format)
6. Replace `[YOUR-PASSWORD]` dengan password Anda

### Step 2: Push ke GitHub

```bash
# Buat repository di GitHub dulu
# Kemudian:
git remote add origin https://github.com/YOUR_USERNAME/topup-games-app.git
git push -u origin main
```

### Step 3: Deploy ke Vercel

1. Login ke [Vercel](https://vercel.com)
2. Klik **Add New Project**
3. Import repository dari GitHub
4. Configure Environment Variables:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-min-32-chars
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

5. Klik **Deploy**

### Step 4: Run Migration

Setelah deploy berhasil:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull

# Deploy migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## 🛠️ Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/topup-games-app.git
cd topup-games-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Generate Prisma client
npm run db:generate

# Run migration (jika pakai local PostgreSQL)
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Demo Accounts

Setelah seeding database:

- **Admin**: `admin@topup.com` / `admin123`
- **User**: `user@example.com` / `user123`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (main)/            # Main app routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── globals.css
│   └── layout.tsx
├── components/            # React components
│   ├── ui/               # UI components
│   └── navbar.tsx
├── lib/                   # Utilities & configs
│   ├── auth.ts           # NextAuth config
│   ├── midtrans.ts       # Payment gateway
│   ├── prisma.ts         # Database client
│   └── utils.ts
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Seed data
├── types/                # TypeScript types
└── public/               # Static files
```

## 📝 Features

### User Features
- 🎮 Browse game categories
- 🛒 Add to cart & checkout
- 💳 Payment with Midtrans
- 📋 Transaction history
- 👤 User profile management

### Admin Features
- 📊 Dashboard with statistics
- 🎮 Manage games & products
- 📦 Manage orders
- 💰 Payment verification
- 👥 User management

## 🔧 Scripts

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:deploy        # Deploy migrations (production)
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Build
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `DIRECT_URL` | Direct database connection | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `NEXTAUTH_SECRET` | Random secret string | ✅ |
| `MIDTRANS_SERVER_KEY` | Midtrans server key | ⚠️ (for payments) |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key | ⚠️ (for payments) |
| `MIDTRANS_IS_PRODUCTION` | `true` or `false` | ⚠️ (for payments) |

## 🚀 Production Checklist

- [ ] Setup PostgreSQL database (Supabase/Railway/Neon)
- [ ] Configure environment variables in Vercel
- [ ] Deploy database migrations
- [ ] Seed database with initial data
- [ ] Setup Midtrans production keys
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Configure payment notification URL in Midtrans dashboard
- [ ] Test all features

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if DATABASE_URL is correct
# Make sure password doesn't contain special characters
# Or encode special characters:
# @ -> %40
# # -> %23
# % -> %25
```

### Build Error
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Migration Error
```bash
# Reset migrations
npx prisma migrate reset

# Or resolve manually
npx prisma migrate resolve --applied [migration-name]
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Support

Jika ada masalah dengan deployment:
1. Cek [DEPLOY.md](DEPLOY.md) untuk panduan detail
2. Cek logs di Vercel Dashboard
3. Pastikan semua environment variables terisi dengan benar

---

**Selamat menggunakan!** 🎮
