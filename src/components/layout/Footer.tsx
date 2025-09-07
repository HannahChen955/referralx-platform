import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold mb-4">ReferralX</div>
            <p className="text-gray-300 mb-4 max-w-md">
              让才华被看见，让连接者成长。这是一个公开的推荐平台，
              帮助更多有才华的人被看见。
            </p>
            <div className="text-sm text-gray-400">
              <p>🔒 隐私保护承诺</p>
              <p className="mt-1">
                您提供的候选人信息仅用于职位匹配和推荐服务，
                绝不用于其他商业用途。
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">
                  职位列表
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-white transition-colors">
                  注册推荐
                </Link>
              </li>
              <li>
                <Link href="/referral/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  推荐进度
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  企业合作
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">支持</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:privacy@referralx.com" className="text-gray-300 hover:text-white transition-colors">
                  隐私问题
                </a>
              </li>
              <li>
                <a href="mailto:support@referralx.com" className="text-gray-300 hover:text-white transition-colors">
                  技术支持
                </a>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 ReferralX Platform. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">
            Made with ❤️ for connecting talents
          </p>
        </div>
      </div>
    </footer>
  )
}