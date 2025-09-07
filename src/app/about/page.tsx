'use client'

import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

interface Person {
  id: number
  name: string
  role: string
  company: string
  avatar: string
  content: string
  highlight?: string
}

// 创始团队语录
const founderQuotes: Person[] = [
  {
    id: 1,
    name: "张明",
    role: "创始人",
    company: "ReferralX",
    avatar: "张",
    content: "我创建ReferralX的初衷很简单：让每一个有才华的人都能被看见。在这个AI时代，技术给了渴望自由又富有创造性的人更强大的工具去实现心中的理想。我希望能够搭建一个这样的平台，给这些人更多的机会通过自己的方式，没有约束地更高效地完成工作，做一个真正的超级个体。兼职猎头只是一个起点，但我们的梦想远不止于此——我们要让每个人都能发挥自己的独特价值，让信任成为最好的推荐信。",
    highlight: "做一个真正的超级个体"
  },
  {
    id: 2,
    name: "陈建国",
    role: "技术合伙人",
    company: "ReferralX",
    avatar: "陈",
    content: "在设计整个平台时，我们考虑最多的是如何保护推荐人和候选人的权益。我们深知用户把人脉和职业信息托付给我们，这份信任来之不易。每一个功能细节我们都反复打磨——从隐私保护机制到推荐流程设计，从数据安全到用户体验，力求让产品既好用又安全可靠。技术的价值不在于炫技，而在于如何更好地服务于人与人之间的信任连接。正是这种对细节的执着和对用户的尊重，让我相信ReferralX能够走得更远。"
  },
  {
    id: 3,
    name: "孙艺文",
    role: "运营负责人",
    company: "ReferralX",
    avatar: "孙",
    content: "每天看到平台上成功的匹配案例，我都深感自豪。我们不只是在运营一个平台，而是在编织一张信任的网络。让我们大大方方地谈钱吧！推荐本来就是非常有价值的行为——你的专业眼光、人脉资源、时间投入都值得被认可和回报。用我们的能力去赚更多的钱，这没什么不好意思的。每一次成功的推荐，都在证明：当我们愿意为他人搭建桥梁时，自己也会收获应有的回报。这就是我们想要创造的价值。当然，除了经济上的回报，我们在这个过程中会获得更大的成长，积累更多的人脉。"
  }
]

// 社区用户声音
const communityVoices: Person[] = [
  {
    id: 4,
    name: "李晓华",
    role: "资深HR总监",
    company: "某互联网大厂",
    avatar: "李",
    content: "做了15年HR，我太了解内推的价值和困境了。传统内推都是基于人情，大家不好意思谈钱——明明公司有内推奖金，但好像提钱就显得功利。这导致很多推荐人只是出于客气帮忙找找，缺乏真正的动力，效果自然一般，我们也就没有真正重视这个渠道。ReferralX打破了这个禁忌，让大家坦然面对推荐的价值交换——推荐本就是专业服务，值得被认可和奖励。当推荐人有了合理的激励，他们会更用心地匹配人才，我们也能找到真正适合团队文化的伙伴。ReferralX不只是个平台，它正在改变整个行业对内推的认知。"
  },
  {
    id: 5,
    name: "王雨晴",
    role: "活跃推荐人",
    company: "产品经理",
    avatar: "王",
    content: "我已经通过ReferralX成功推荐了6位朋友入职。起初我很犹豫，觉得为了奖金推荐朋友像是在占他们便宜。试探性地询问后，朋友的回应让我释然：'你提前跟我打招呼了，最终决定权在我手上，我可以接受也可以拒绝。而且很多优秀的人每年都会主动去面试几次，测试自己的市场价值。你帮我省了找机会的时间，我感谢你还来不及呢！'确实，每个成功入职的朋友都请我吃饭表示感谢。这个平台不仅让我的人脉变成了价值，还在过程中不断拓宽了我的网络。看到朋友们在新岗位上开启新旅程的满足，给了我继续推荐的信心和动力。"
  },
  {
    id: 6,
    name: "赵梦琪",
    role: "成功入职者",
    company: "前端工程师",
    avatar: "赵",
    content: "那段时间我忙到麻木，每天只能机械地应付工作，连休息时间都不够，更别提改简历找工作了。虽然心里一直想换工作，但就是没精力行动。好朋友了解我的状况后，在ReferralX上帮我留意机会。她先把我的工作情况大致告诉了平台（平台很专业地提醒她在未经同意前不要透露个人敏感信息），平台的工作人员快速根据我的背景做了精准匹配。朋友告诉我匹配结果很理想，相比毫无目的地海投，ReferralX让我能更确定地行动，最终换到了满意的工作。我感谢朋友的帮助，也感谢平台提供这样的机会。现在我自己也注册成了推荐人，希望能帮到更多像当初的我一样的人。"
  },
  {
    id: 7,
    name: "刘志远",
    role: "天使投资人",
    company: "远见资本",
    avatar: "刘",
    content: "传统招聘市场被少数几个平台垄断，所有的公司、猎头都在同一个池子里找人，接触到的候选人高度重复。虽然HR和猎头的专业积累、自有候选人库很重要，但仍难以摆脱对平台的依赖，很难实现真正的差异化招聘。ReferralX另辟蹊径，通过激活整个社会的人脉网络，让每个人都能成为人才发现者，大大拓宽了招聘渠道。这不只是效率的提升，更是招聘生态的重构——从平台垄断到全民参与，我相信这才是未来招聘的主流模式。"
  },
  {
    id: 8,
    name: "林自由",
    role: "自由职业推荐人",
    company: "独立顾问",
    avatar: "林",
    content: "辞职后一直在寻找能发挥自己特长又不被束缚的机会。我擅长识别人才，喜欢与不同的人交流，了解他们的需求和能力。ReferralX给了我这样的平台——我可以自由安排时间，通过自己的人脉和判断力帮助别人找到心仪工作，同时获得可观收入。这种工作方式让我既能帮助他人，又能实现经济独立，完全符合我对自由职业的期待。更重要的是，推荐候选人的过程让我从不同角度观察职场、理解工作、了解公司，每一次促成推荐都是对自己职业生涯的重新审视和深度思考。"
  },
  {
    id: 9,
    name: "周慧敏",
    role: "企业客户",
    company: "创业公司CEO",
    avatar: "周",
    content: "ReferralX对现有招聘渠道做了一次极具意义的扩展，更广泛的推荐人网络充分体现了平台的革新精神——敢于挑战传统模式，进行有价值的探索。更让我惊叹的是，我听说整个网站的雏形是由毫无技术背景的创始人，仅用一天时间借助AI搭建完成的。他对AI工具的大胆尝试和对应用边界的精准把握让我深受启发。在AI时代，ReferralX不仅革新了招聘模式，更展示了AI赋能普通人创造非凡价值的可能性。这种探索精神正是我们在AI时代最需要学习的。"
  }
]

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            关于 ReferralX
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            连接信任，传递价值，让每一份才华都被看见
          </p>
        </div>

        {/* Vision Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">我们的愿景</h2>
              <p className="text-lg opacity-95">
                构建一个基于信任的职业网络，让每个人都能成为连接者，
                帮助身边的优秀人才找到理想的职业机会，同时获得应有的回报。
              </p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">连接</h3>
                  <p className="text-gray-600 text-sm">
                    打破信息壁垒，让人才与机会高效连接
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">信任</h3>
                  <p className="text-gray-600 text-sm">
                    基于真实社交关系的推荐，更可靠更高效
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">共赢</h3>
                  <p className="text-gray-600 text-sm">
                    推荐人、候选人、企业三方共赢的生态系统
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 创始团队语录 */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            创始团队语录
          </h2>
          
          <div className="space-y-8">
            {founderQuotes.map((quote, index) => (
              <div key={quote.id} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-4xl ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  {/* 人物信息 */}
                  <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {quote.avatar}
                      </div>
                      <div className={`${index % 2 === 0 ? 'ml-4' : 'mr-4'} ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                        <h3 className="text-xl font-bold text-gray-900">{quote.name}</h3>
                        <p className="text-gray-600">{quote.role}</p>
                        <p className="text-sm text-gray-500">{quote.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 语录内容 */}
                  <div className={`bg-gradient-to-r ${index % 2 === 0 ? 'from-blue-50 to-white' : 'from-white to-purple-50'} rounded-2xl p-6 shadow-md border border-gray-100`}>
                    {quote.highlight && (
                      <p className="text-lg font-semibold text-blue-700 italic mb-4">
                        &ldquo;{quote.highlight}&rdquo;
                      </p>
                    )}
                    <p className="text-gray-800 leading-relaxed text-base">
                      {quote.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 来自社区的声音 */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            来自社区的声音
          </h2>
          
          <div className="space-y-8">
            {communityVoices.map((voice, index) => (
              <div key={voice.id} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-4xl ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  {/* 人物信息 */}
                  <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {voice.avatar}
                      </div>
                      <div className={`${index % 2 === 0 ? 'ml-4' : 'mr-4'} ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                        <h3 className="text-lg font-semibold text-gray-900">{voice.name}</h3>
                        <p className="text-gray-600 text-sm">{voice.role}</p>
                        <p className="text-xs text-gray-500">{voice.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 评价内容 */}
                  <div className={`bg-gradient-to-r ${index % 2 === 0 ? 'from-gray-50 to-blue-50' : 'from-green-50 to-gray-50'} rounded-2xl p-6 shadow-sm border border-gray-100`}>
                    <p className="text-gray-800 leading-relaxed text-base">
                      {voice.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                加入我们，一起改变招聘的未来
              </h3>
              <p className="text-gray-600 mb-6">
                无论你是想推荐优秀人才，还是正在寻找理想工作，
                ReferralX都欢迎你的加入
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/jobs" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
                  浏览职位
                </Link>
                <Link href="/contact" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-block">
                  企业合作
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}