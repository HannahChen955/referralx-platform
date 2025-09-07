import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function testPrisma() {
  try {
    console.log('🔍 测试Prisma客户端连接...\n')
    
    // 1. 测试查询职位
    const jobs = await prisma.job.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        company: true,
        salaryMin: true,
        salaryMax: true
      }
    })
    console.log('✅ 查询职位成功:')
    jobs.forEach(job => {
      console.log(`  - ${job.title} @ ${job.company} (¥${job.salaryMin}-${job.salaryMax}K)`)
    })
    
    // 2. 测试创建用户
    const testUser = await prisma.user.create({
      data: {
        phone: '13800138000',
        name: '测试用户',
        email: 'test@example.com'
      }
    })
    console.log('\n✅ 创建用户成功:', testUser.name)
    
    // 3. 测试创建推荐
    const testReferral = await prisma.referral.create({
      data: {
        jobId: jobs[0].id,
        userId: testUser.id,
        candidateName: '张三',
        candidatePhone: '13900139000',
        candidateEmail: 'zhangsan@example.com',
        reason: '技术能力强，有相关经验',
        status: 'SUBMITTED'
      },
      include: {
        job: {
          select: { title: true, company: true }
        },
        user: {
          select: { name: true }
        }
      }
    })
    console.log('\n✅ 创建推荐成功:')
    console.log(`  推荐人: ${testReferral.user.name}`)
    console.log(`  候选人: ${testReferral.candidateName}`)
    console.log(`  职位: ${testReferral.job.title} @ ${testReferral.job.company}`)
    
    // 4. 测试更新进度
    const progress = await prisma.referralProgress.create({
      data: {
        referralId: testReferral.id,
        stage: 'RECRUITER_REVIEW',
        notes: '已提交给猎头初筛',
        rewardAmount: 200
      }
    })
    console.log('\n✅ 创建进度记录成功: 阶段=', progress.stage)
    
    // 5. 清理测试数据
    await prisma.referralProgress.deleteMany({ where: { referralId: testReferral.id } })
    await prisma.referral.deleteMany({ where: { userId: testUser.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    console.log('\n✅ 清理测试数据成功')
    
    console.log('\n🎉 所有测试通过！数据库功能正常。')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPrisma()