import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

const sampleJobs = [
  {
    title: '高级前端工程师',
    company: '阿里巴巴',
    location: '杭州',
    salaryMin: 20000,
    salaryMax: 40000,
    description: `负责集团核心业务前端架构设计和开发工作，参与产品需求分析和技术方案制定。

主要职责：
• 参与前端架构设计，制定技术方案和开发规范
• 负责核心业务模块的前端开发和维护
• 优化前端性能，提升用户体验
• 指导初中级工程师，参与团队技术分享`,
    requirements: `任职要求：
• 3年以上前端开发经验，熟练掌握React/Vue等主流框架
• 熟悉TypeScript、Webpack、Vite等现代前端工具链
• 有大型项目架构经验，了解微前端架构
• 熟悉Node.js，有全栈开发经验优先
• 良好的代码规范意识和团队协作能力`,
    benefits: '五险一金，年终奖，股票期权，弹性工作制，免费三餐',
    referralLimit: 30
  },
  {
    title: '资深产品经理',
    company: '腾讯',
    location: '深圳',
    salaryMin: 25000,
    salaryMax: 50000,
    description: `负责微信生态产品的规划、设计和运营，推动产品创新和业务增长。

主要职责：
• 负责产品需求调研、竞品分析和市场研究
• 制定产品规划和功能设计，编写PRD文档
• 协调技术、设计、运营等团队推进产品开发
• 数据分析驱动产品优化决策`,
    requirements: `任职要求：
• 5年以上互联网产品经验，有C端产品成功案例
• 熟悉用户体验设计，有敏锐的产品洞察力
• 优秀的项目管理和跨团队协作能力
• 数据分析能力强，能基于数据做产品决策
• 优秀的沟通表达和逻辑思维能力`,
    benefits: '六险一金，年终奖，股票激励，团建预算，健身房',
    referralLimit: 20
  },
  {
    title: 'Java架构师',
    company: '美团',
    location: '北京',
    salaryMin: 30000,
    salaryMax: 60000,
    description: `负责美团核心交易系统的架构设计和技术规划，支撑亿级用户的高并发业务场景。

主要职责：
• 负责分布式系统架构设计，制定技术架构方案
• 解决高并发、高可用、高性能的技术挑战
• 参与核心系统重构和技术升级
• 指导团队技术发展，培养技术人才`,
    requirements: `任职要求：
• 8年以上Java开发经验，5年以上架构设计经验
• 深入理解分布式系统，熟悉微服务架构
• 熟悉Spring Cloud、Dubbo等分布式框架
• 有大型互联网项目架构经验，处理过高并发场景
• 优秀的技术视野和团队领导能力`,
    benefits: '七险二金，股票期权，年终奖，技术培训预算',
    referralLimit: 15
  },
  {
    title: '数据科学家',
    company: '字节跳动',
    location: '北京',
    salaryMin: 25000,
    salaryMax: 45000,
    description: `利用数据科学和机器学习技术，为推荐系统、广告投放等核心业务提供算法支持。

主要职责：
• 设计和开发机器学习算法，优化推荐系统效果
• 进行大数据分析，挖掘用户行为模式
• 参与A/B测试设计和效果评估
• 与产品和工程团队合作，落地算法方案`,
    requirements: `任职要求：
• 计算机、统计学或相关专业硕士以上学历
• 3年以上机器学习或数据科学工作经验
• 熟练掌握Python、SQL、Spark等数据处理工具
• 熟悉深度学习框架如TensorFlow、PyTorch
• 有推荐系统、NLP或计算机视觉经验优先`,
    benefits: '股票期权，六险一金，免费三餐，班车接送',
    referralLimit: 25
  },
  {
    title: 'UI/UX设计师',
    company: '小红书',
    location: '上海',
    salaryMin: 15000,
    salaryMax: 30000,
    description: `负责小红书App和Web端的用户界面设计，提升用户体验和产品视觉表现。

主要职责：
• 负责产品界面设计，制定设计规范和组件库
• 参与用户研究，优化用户体验流程
• 与产品经理和工程师协作，推进设计方案落地
• 参与品牌视觉设计和营销物料制作`,
    requirements: `任职要求：
• 3年以上UI/UX设计经验，有移动端设计经验
• 熟练使用Figma、Sketch、Adobe系列设计工具
• 有优秀的视觉设计能力和用户体验思维
• 了解前端技术，能与工程师有效协作
• 有社交或内容类产品设计经验优先`,
    benefits: '五险一金，年终奖，设计培训，MacBook Pro',
    referralLimit: 20
  },
  {
    title: '运维工程师',
    company: '滴滴',
    location: '北京',
    salaryMin: 18000,
    salaryMax: 35000,
    description: `负责滴滴出行核心系统的运维保障，确保系统稳定性和高可用性。

主要职责：
• 负责生产环境的系统部署、监控和故障处理
• 设计和实施自动化运维方案，提升运维效率
• 参与容器化和云原生技术落地
• 制定应急预案，处理线上故障`,
    requirements: `任职要求：
• 5年以上Linux运维经验，熟悉shell脚本编程
• 熟悉Docker、Kubernetes等容器技术
• 有大型分布式系统运维经验
• 熟悉监控体系建设，如Prometheus、Grafana
• 有云平台（阿里云、AWS）使用经验优先`,
    benefits: '五险一金，期权激励，年终奖，技能培训',
    referralLimit: 25
  },
  {
    title: '销售总监',
    company: '华为',
    location: '深圳',
    salaryMin: 35000,
    salaryMax: 70000,
    description: `负责华为企业业务销售团队管理，制定销售策略，完成业绩目标。

主要职责：
• 制定区域销售策略和业务计划，完成销售目标
• 管理销售团队，提升团队业务能力
• 维护重要客户关系，拓展新的业务机会
• 参与重大项目谈判和方案制定`,
    requirements: `任职要求：
• 8年以上B2B销售经验，5年以上销售管理经验
• 有IT或通信行业销售背景，了解企业市场
• 优秀的客户关系管理和团队领导能力
• 良好的商务谈判和演讲表达能力
• 有大客户销售成功案例`,
    benefits: '高额提成，股票激励，海外培训机会',
    referralLimit: 10
  },
  {
    title: '市场营销专家',
    company: '网易',
    location: '杭州',
    salaryMin: 20000,
    salaryMax: 35000,
    description: `负责网易游戏产品的市场推广策略制定和执行，提升品牌知名度和用户获取。

主要职责：
• 制定产品营销策略，规划推广活动
• 管理品牌传播和公关活动，维护品牌形象
• 分析市场趋势和竞品动态，优化营销策略
• 协调内外部资源，执行营销项目`,
    requirements: `任职要求：
• 5年以上市场营销经验，有游戏或娱乐行业背景
• 熟悉数字营销和社交媒体运营
• 优秀的创意策划和项目管理能力
• 数据分析能力强，能基于数据优化营销效果
• 有成功的营销案例和丰富的媒体资源`,
    benefits: '五险一金，年终奖，项目奖金，团建预算',
    referralLimit: 15
  }
]

async function main() {
  console.log('开始创建种子数据...')
  
  // 清空现有数据
  await prisma.referralProgress.deleteMany()
  await prisma.referral.deleteMany()
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()

  // 创建职位数据
  for (const jobData of sampleJobs) {
    const job = await prisma.job.create({
      data: jobData
    })
    console.log(`创建职位: ${job.title} - ${job.company}`)
  }

  console.log('种子数据创建完成!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })