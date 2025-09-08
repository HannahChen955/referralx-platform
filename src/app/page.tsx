import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function HomePage() {
  // 组织结构化数据
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ReferralX",
    "alternateName": "ReferralX推荐赚钱平台",
    "description": "中国领先的推荐赚钱平台，通过内推朋友找工作获得丰厚推荐奖金。副业推荐、招聘内推、推荐赚钱的最佳选择。",
    "url": "https://referralx-platform-am78.vercel.app",
    "logo": "https://referralx-platform-am78.vercel.app/logo.png",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "ReferralX Team"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN",
      "addressRegion": "中国"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@referralx.com"
    },
    "sameAs": [
      "https://github.com/HannahChen955/referralx-platform"
    ],
    "knowsAbout": [
      "推荐赚钱",
      "副业推荐", 
      "内推招聘",
      "推荐奖金",
      "副业赚钱",
      "招聘推荐"
    ],
    "serviceType": "推荐赚钱平台",
    "areaServed": "中国"
  }

  // 网站结构化数据
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ReferralX",
    "url": "https://referralx-platform-am78.vercel.app",
    "description": "推荐赚钱副业平台 - 通过内推朋友找工作获得推荐奖金",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://referralx-platform-am78.vercel.app/jobs?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      
      <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          让才华被看见，让连接者成长
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          这是一个公开的推荐平台，旨在帮助更多有才华的人被看见。
          推荐人通过自己的观察和连接能力，主动促成优秀人才和好机会的相遇。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/jobs">
            <Button size="lg">查看职位</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="lg">注册推荐</Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">人才推荐</h3>
            <p className="text-gray-600">
              推荐你认识的优秀人才，帮助他们找到更好的职业机会
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">获得奖励</h3>
            <p className="text-gray-600">
              成功推荐可获得分阶段奖金，从初筛到入职过保都有奖励
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">进度跟踪</h3>
            <p className="text-gray-600">
              实时查看推荐进度，从提交到入职全程透明可见
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}