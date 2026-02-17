#!/bin/bash

# Deployment Automation Script for Topup Games App
# Usage: ./deploy.sh

echo "🚀 Topup Games App Deployment Script"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo "Install from: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met${NC}"
    echo ""
}

# Install dependencies
install_deps() {
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
}

# Generate Prisma client
generate_prisma() {
    echo "🔄 Generating Prisma client..."
    npx prisma generate
    echo -e "${GREEN}✅ Prisma client generated${NC}"
    echo ""
}

# Build application
build_app() {
    echo "🔨 Building application..."
    npm run build
    echo -e "${GREEN}✅ Build successful${NC}"
    echo ""
}

# Main deployment flow
echo "This script will help you deploy the application."
echo ""
echo "You need to manually complete these steps:"
echo ""
echo -e "${YELLOW}1. Create Supabase Project:${NC}"
echo "   - Visit: https://supabase.com"
echo "   - Create new project"
echo "   - Copy DATABASE_URL from Settings > Database"
echo ""
echo -e "${YELLOW}2. Create GitHub Repository:${NC}"
echo "   - Visit: https://github.com/new"
echo "   - Repository name: topup-games-app"
echo "   - Keep it private or public"
echo ""
echo -e "${YELLOW}3. Deploy to Vercel:${NC}"
echo "   - Visit: https://vercel.com/new"
echo "   - Import from GitHub"
echo "   - Add environment variables"
echo ""

read -p "Have you completed step 1 (Supabase)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your DATABASE_URL: " db_url
    
    # Create .env file
    echo "Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="$db_url"
DIRECT_URL="$db_url"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="topup-games-secret-key-$(date +%s)"

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"
EOF
    
    echo -e "${GREEN}✅ .env file created${NC}"
    
    # Run migrations
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy
    
    # Seed database
    echo "🌱 Seeding database..."
    npx prisma db seed
    
    echo -e "${GREEN}✅ Database setup complete!${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/topup-games-app.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Visit https://vercel.com/new"
echo "   - Import your repository"
echo "   - Add environment variables from .env file"
echo ""
echo "3. Update NEXTAUTH_URL in Vercel to your production URL"
echo ""
