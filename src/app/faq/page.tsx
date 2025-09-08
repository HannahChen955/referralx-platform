import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '常见问题 - ReferralX推荐赚钱平台 | 副业推荐FAQ',
  description: '关于ReferralX推荐赚钱平台的常见问题解答，包括如何通过推荐朋友找工作赚取奖金，副业推荐的具体流程等。',
  keywords: '推荐赚钱FAQ,副业推荐问题,内推平台问答,推荐奖金说明,ReferralX常见问题',
}

export default function FAQPage() {
  const faqData = [
    {
      question: "什么是ReferralX？如何通过推荐赚钱？",
      answer: "ReferralX是中国领先的推荐赚钱平台。您可以通过推荐朋友、同事或认识的人到合适的工作机会来获得推荐奖金。当您推荐的候选人成功入职并通过试用期后，您将获得丰厚的推荐奖励，这是一个很好的副业赚钱方式。"
    },
    {
      question: "推荐奖金有多少？什么时候发放？",
      answer: "推荐奖金根据职位级别和薪资范围而定，通常在候选人年薪的3%-15%之间。奖金分两次发放：候选人入职后发放50%，通过3个月试用期后发放剩余50%。具体金额在职位详情中会明确标注。"
    },
    {
      question: "我需要什么资格才能成为推荐人？",
      answer: "任何人都可以成为推荐人！您不需要特殊的资格或经验。只要您有合适的人选推荐，了解候选人的能力和工作经历，就可以在我们平台上进行推荐。这是一个人人都可以参与的副业赚钱机会。"
    },
    {
      question: "推荐流程是怎样的？",
      answer: "推荐流程很简单：1) 在平台上浏览职位；2) 找到合适的职位后，提交候选人信息和简历；3) 我们的HR团队会联系候选人进行初步筛选；4) 通过筛选的候选人会进入正式面试流程；5) 候选人成功入职后，您获得推荐奖金。"
    },
    {
      question: "如何确保我的推荐得到认可？",
      answer: "我们有完善的推荐追踪系统。每个推荐都有唯一的ID，您可以实时查看推荐进度。我们承诺，只要是通过您的推荐成功入职的候选人，您一定会获得相应的推荐奖金。"
    },
    {
      question: "可以推荐多少人？有限制吗？",
      answer: "没有推荐人数限制！您可以推荐任意数量的候选人到不同的职位。推荐越多，赚得越多。这使得推荐成为一个很好的副业选择。"
    },
    {
      question: "推荐被拒绝了怎么办？",
      answer: "如果候选人不符合职位要求被拒绝，这很正常，不会影响您的推荐人资格。我们建议您仔细阅读职位要求，推荐更匹配的候选人，这样成功率会更高。"
    },
    {
      question: "ReferralX与传统猎头有什么不同？",
      answer: "传统猎头通常只服务于企业，而ReferralX让每个人都能参与推荐赚钱。我们的平台更透明、更公开，任何人都可以看到职位信息并进行推荐。这为更多人提供了副业赚钱的机会。"
    },
    {
      question: "我的个人信息安全吗？",
      answer: "我们严格保护用户隐私和数据安全。所有个人信息都经过加密存储，只有相关的HR人员才能查看必要的信息。我们绝不会泄露您的个人信息给第三方。"
    },
    {
      question: "如何联系客服？",
      answer: "如果您有任何问题，可以通过以下方式联系我们：1) 发送邮件至 support@referralx.com；2) 在线客服咨询；3) 关注我们的微信公众号获取最新资讯。我们会在24小时内回复您的问题。"
    }
  ]

  // FAQ结构化数据
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h1>
            <p className="text-xl text-gray-600">
              关于ReferralX推荐赚钱平台的常见问题解答
            </p>
          </div>

          <div className="space-y-8">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.question}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              还有其他问题？
            </p>
            <a 
              href="mailto:support@referralx.com"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              联系客服
            </a>
          </div>
        </div>
      </div>
    </>
  )
}