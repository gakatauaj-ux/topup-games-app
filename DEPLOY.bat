@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║        🚀 TOPUP GAMES APP - EASY DEPLOYMENT              ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo LANGKAH 1: Buat Database Supabase
echo --------------------------------
echo 1. Buka browser: https://supabase.com
echo 2. Login / Sign up
echo 3. Klik "New Project"
echo 4. Isi:
echo    - Name: topup-games
echo    - Password: (buat password kuat, catat!)
echo    - Region: Singapore
echo 5. Tunggu 1-2 menit sampai project ready
echo 6. Klik Project Settings -^> Database
echo 7. Copy "Connection string" (yang URI format)
echo.
set /p DB_URL="Paste DATABASE_URL di sini: "
echo.

REM Update .env file
echo # Database > .env
echo DATABASE_URL="%DB_URL%" >> .env
echo DIRECT_URL="%DB_URL%" >> .env
echo. >> .env
echo # NextAuth.js >> .env
echo NEXTAUTH_URL="http://localhost:3000" >> .env
echo NEXTAUTH_SECRET="topup-games-secret-key-2024" >> .env
echo. >> .env
echo # Midtrans (Sandbox) >> .env
echo MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxxxx" >> .env
echo MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxx" >> .env
echo MIDTRANS_IS_PRODUCTION="false" >> .env

echo ✅ File .env berhasil dibuat!
echo.

REM Push to GitHub
echo LANGKAH 2: Push ke GitHub
echo --------------------------
echo 1. Buka: https://github.com/new
echo 2. Repository name: topup-games-app
echo 3. Jangan centang "Initialize with README"
echo 4. Klik "Create repository"
echo 5. Copy URL repository (contoh: https://github.com/username/topup-games-app.git)
echo.
set /p REPO_URL="Paste repository URL di sini: "
echo.

git remote add origin %REPO_URL% 2>nul
git branch -M main
git push -u origin main

echo ✅ Code berhasil di-push ke GitHub!
echo.

REM Install Vercel CLI and deploy
echo LANGKAH 3: Install Vercel CLI
echo -------------------------------
echo Menginstall Vercel CLI...
npm install -g vercel

echo.
echo ✅ Vercel CLI terinstall!
echo.
echo LANGKAH 4: Deploy ke Vercel
echo ---------------------------
echo Ikuti instruksi di terminal:
echo - Login dengan GitHub (tekan Enter, lalu buka link di browser)
echo - Pilih "Continue with GitHub"
echo - Pilih project "topup-games-app"
echo - Pilih scope (biasanya nama username Anda)
echo.
echo Tekan Enter untuk mulai deploy...
pause >nul

vercel --prod

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              🎉 DEPLOYMENT BERHASIL!                      ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo LANGKAH 5: Setup Database (Jalankan setelah deploy)
echo ---------------------------------------------------
echo 1. Buka: https://vercel.com/dashboard
echo 2. Klik project "topup-games-app"
echo 3. Klik tab "Storage" atau "Environment Variables"
echo 4. Tambahkan environment variables dari file .env
echo 5. Copy semua isi .env ke Vercel Environment Variables
echo 6. Re-deploy (Vercel akan otomatis re-deploy)
echo.
echo Setelah itu, jalankan command ini di terminal:
echo.
echo   vercel env pull
echo   npx prisma migrate deploy
echo   npx prisma db seed
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  🌐 Website Anda akan live di URL dari Vercel             ║
echo ║  Demo Accounts:                                           ║
echo ║    Admin: admin@topup.com / admin123                      ║
echo ║    User:  user@example.com / user123                      ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
pause
