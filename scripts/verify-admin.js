require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function verifyAdmin() {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: 'admin@referralx.com' }
    })

    if (!admin) {
      console.log('❌ 管理员不存在')
      return
    }

    console.log('✅ 找到管理员:', admin.email)
    console.log('🔍 测试密码: ReferralX@2024!')
    
    const isValid = await bcrypt.compare('ReferralX@2024!', admin.password)
    console.log('✅ 密码匹配:', isValid)

    if (!isValid) {
      console.log('🔄 重新生成密码哈希...')
      const newHash = await bcrypt.hash('ReferralX@2024!', 12)
      await prisma.adminUser.update({
        where: { email: 'admin@referralx.com' },
        data: { password: newHash }
      })
      console.log('✅ 密码已重置')
    }

  } catch (error) {
    console.error('❌ 验证失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAdmin()