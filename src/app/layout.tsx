import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReferralX - 推荐赚钱副业平台 | 内推招聘奖金平台 | 副业推荐赚钱',
  description: '中国领先的推荐赚钱平台，通过内推朋友找工作获得丰厚推荐奖金。副业推荐、招聘内推、推荐赚钱的最佳选择。ReferralX让每个人都能通过推荐获得收益。',
  keywords: '推荐赚钱,副业推荐,内推平台,招聘推荐,推荐奖金,副业赚钱,内推招聘,ReferralX,招聘平台,求职推荐',
  authors: [{ name: 'ReferralX Team' }],
  creator: 'ReferralX',
  publisher: 'ReferralX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ReferralX - 推荐赚钱副业平台',
    description: '通过内推朋友找工作获得推荐奖金，中国领先的副业推荐赚钱平台',
    url: 'https://referralx-platform-am78.vercel.app',
    siteName: 'ReferralX',
    images: [
      {
        url: '/api/og-image', // 我们稍后创建这个
        width: 1200,
        height: 630,
        alt: 'ReferralX - 推荐赚钱平台',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReferralX - 推荐赚钱副业平台',
    description: '通过内推朋友找工作获得推荐奖金，副业推荐赚钱首选平台',
    images: ['/api/og-image'],
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      nosnippet: true,
    },
  },
  verification: {
    google: 'google-site-verification-code', // 需要添加真实的验证码
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}