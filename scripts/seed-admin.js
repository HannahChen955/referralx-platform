require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedAdmin() {
  try {
    // 检查是否已存在管理员
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: 'admin@referralx.com' }
    })

    if (existingAdmin) {
      console.log('管理员账户已存在')
      return
    }

    // 创建默认管理员
    const hashedPassword = await bcrypt.hash('ReferralX@2024!', 12)
    
    const admin = await prisma.adminUser.create({
      data: {
        email: 'admin@referralx.com',
        password: hashedPassword,
        name: 'ReferralX Administrator',
        role: 'ADMIN'
      }
    })

    console.log('✅ 默认管理员账户创建成功:')
    console.log('   邮箱: admin@referralx.com')
    console.log('   密码: ReferralX@2024!')
    console.log('   ID:', admin.id)

  } catch (error) {
    console.error('❌ 创建管理员失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()