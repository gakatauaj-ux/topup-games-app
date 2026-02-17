const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      }
    })
    
    console.log('Users in database:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Password exists: ${!!user.password}`)
    })
    
    // Check specific demo accounts
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@topup.com' }
    })
    
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    })
    
    console.log('\nAdmin user exists:', !!admin)
    console.log('Test user exists:', !!testUser)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
