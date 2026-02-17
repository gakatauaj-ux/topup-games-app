import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@topup.com' },
    update: {},
    create: {
      email: 'admin@topup.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('Created test user:', user.email)

  // Create Categories
  const categories = [
    {
      name: 'Mobile Legends',
      slug: 'mobile-legends',
      description: 'Top up diamonds Mobile Legends',
      image: '/games/mobile-legends.jpg',
    },
    {
      name: 'Free Fire',
      slug: 'free-fire',
      description: 'Top up diamonds Free Fire',
      image: '/games/free-fire.jpg',
    },
    {
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      description: 'Top up UC PUBG Mobile',
      image: '/games/pubg-mobile.jpg',
    },
    {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      description: 'Top up Genesis Crystals',
      image: '/games/genshin-impact.jpg',
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log('Created categories')

  // Get category IDs
  const mlCategory = await prisma.category.findUnique({ where: { slug: 'mobile-legends' } })
  const ffCategory = await prisma.category.findUnique({ where: { slug: 'free-fire' } })
  const pubgCategory = await prisma.category.findUnique({ where: { slug: 'pubg-mobile' } })
  const genshinCategory = await prisma.category.findUnique({ where: { slug: 'genshin-impact' } })

  // Create Products with Variants
  
  // Mobile Legends Diamonds
  if (mlCategory) {
    const mlProduct = await prisma.product.upsert({
      where: { slug: 'mobile-legends-diamonds' },
      update: {},
      create: {
        name: 'Mobile Legends Diamonds',
        slug: 'mobile-legends-diamonds',
        description: 'Diamonds untuk Mobile Legends: Bang Bang',
        image: '/products/ml-diamonds.jpg',
        categoryId: mlCategory.id,
        variants: {
          create: [
            { name: '86 Diamonds', price: 15000, stock: 999, sku: 'ML-86' },
            { name: '172 Diamonds', price: 28000, stock: 999, sku: 'ML-172' },
            { name: '257 Diamonds', price: 40000, stock: 999, sku: 'ML-257' },
            { name: '344 Diamonds', price: 52000, stock: 999, sku: 'ML-344' },
            { name: '514 Diamonds', price: 78000, stock: 999, sku: 'ML-514' },
            { name: '706 Diamonds', price: 105000, stock: 999, sku: 'ML-706' },
            { name: '1050 Diamonds', price: 155000, stock: 999, sku: 'ML-1050' },
            { name: '1412 Diamonds', price: 208000, stock: 999, sku: 'ML-1412' },
          ],
        },
      },
    })
    console.log('Created Mobile Legends product with variants')
  }

  // Free Fire Diamonds
  if (ffCategory) {
    const ffProduct = await prisma.product.upsert({
      where: { slug: 'free-fire-diamonds' },
      update: {},
      create: {
        name: 'Free Fire Diamonds',
        slug: 'free-fire-diamonds',
        description: 'Diamonds untuk Garena Free Fire',
        image: '/products/ff-diamonds.jpg',
        categoryId: ffCategory.id,
        variants: {
          create: [
            { name: '100 Diamonds', price: 14000, stock: 999, sku: 'FF-100' },
            { name: '310 Diamonds', price: 40000, stock: 999, sku: 'FF-310' },
            { name: '520 Diamonds', price: 65000, stock: 999, sku: 'FF-520' },
            { name: '1060 Diamonds', price: 130000, stock: 999, sku: 'FF-1060' },
            { name: '2180 Diamonds', price: 260000, stock: 999, sku: 'FF-2180' },
            { name: '5600 Diamonds', price: 650000, stock: 999, sku: 'FF-5600' },
          ],
        },
      },
    })
    console.log('Created Free Fire product with variants')
  }

  // PUBG Mobile UC
  if (pubgCategory) {
    const pubgProduct = await prisma.product.upsert({
      where: { slug: 'pubg-mobile-uc' },
      update: {},
      create: {
        name: 'PUBG Mobile UC',
        slug: 'pubg-mobile-uc',
        description: 'Unknown Cash untuk PUBG Mobile',
        image: '/products/pubg-uc.jpg',
        categoryId: pubgCategory.id,
        variants: {
          create: [
            { name: '60 UC', price: 15000, stock: 999, sku: 'PUBG-60' },
            { name: '325 UC', price: 75000, stock: 999, sku: 'PUBG-325' },
            { name: '660 UC', price: 150000, stock: 999, sku: 'PUBG-660' },
            { name: '1800 UC', price: 380000, stock: 999, sku: 'PUBG-1800' },
            { name: '3850 UC', price: 750000, stock: 999, sku: 'PUBG-3850' },
            { name: '8100 UC', price: 1500000, stock: 999, sku: 'PUBG-8100' },
          ],
        },
      },
    })
    console.log('Created PUBG Mobile product with variants')
  }

  // Genshin Impact Genesis Crystals
  if (genshinCategory) {
    const genshinProduct = await prisma.product.upsert({
      where: { slug: 'genshin-genesis-crystals' },
      update: {},
      create: {
        name: 'Genshin Impact Genesis Crystals',
        slug: 'genshin-genesis-crystals',
        description: 'Genesis Crystals untuk Genshin Impact',
        image: '/products/genshin-crystals.jpg',
        categoryId: genshinCategory.id,
        variants: {
          create: [
            { name: '60 Crystals', price: 15000, stock: 999, sku: 'GENSHIN-60' },
            { name: '330 Crystals', price: 79000, stock: 999, sku: 'GENSHIN-330' },
            { name: '1090 Crystals', price: 249000, stock: 999, sku: 'GENSHIN-1090' },
            { name: '2240 Crystals', price: 499000, stock: 999, sku: 'GENSHIN-2240' },
            { name: '3880 Crystals', price: 799000, stock: 999, sku: 'GENSHIN-3880' },
            { name: '8080 Crystals', price: 1599000, stock: 999, sku: 'GENSHIN-8080' },
          ],
        },
      },
    })
    console.log('Created Genshin Impact product with variants')
  }

  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
