import { Card, CardContent } from '@/components/ui/Card'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">企业合作</h1>
          <p className="text-xl text-gray-600">携手共创，为您的企业发展贡献力量</p>
        </div>

        {/* 主要内容卡片 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">感谢您的关注</h2>
              
              <p className="text-gray-700 mb-4">
                我们非常感谢您对 ReferralX 平台的关注。作为一个专注于人才推荐的平台，
                我们致力于高效匹配高质量的人才，帮助企业找到最合适的候选人。
              </p>

              <p className="text-gray-700 mb-4">
                为了确保职位信息的真实性和质量，我们目前暂未开放外部企业自主上传职位需求的功能。
                我们的团队正在努力开发这一功能，预计将在近期上线。
              </p>

              <p className="text-gray-700 mb-6">
                在此期间，如果您有任何招聘需求或合作意向，请通过以下方式与我们联系，
                我们的专业团队将竭诚为您服务。
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                <p className="text-blue-900 font-medium mb-2">我们的承诺</p>
                <p className="text-blue-800">
                  我们愿意成为您最可靠、最忠实的合作伙伴，为您公司的业务发展贡献自己的力量。
                  通过精准的人才匹配和专业的服务，助力您的企业实现更大的成功。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系方式 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">商务合作邮箱</h3>
                  <p className="text-gray-600 mb-1">business@referralx.com</p>
                  <p className="text-sm text-gray-500">工作日 24 小时内回复</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">商务合作热线</h3>
                  <p className="text-gray-600 mb-1">400-888-9999</p>
                  <p className="text-sm text-gray-500">工作日 9:00-18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">办公地址</h3>
                  <p className="text-gray-600">北京市朝阳区</p>
                  <p className="text-gray-600">建国路88号SOHO现代城</p>
                  <p className="text-sm text-gray-500">仅接受预约拜访</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">微信客服</h3>
                  <p className="text-gray-600 mb-1">ReferralX_Service</p>
                  <p className="text-sm text-gray-500">添加时请注明来意</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 合作流程 */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">合作流程</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">联系我们</h3>
                  <p className="text-gray-600">通过邮件或电话与我们取得联系，说明您的招聘需求</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">需求确认</h3>
                  <p className="text-gray-600">我们的专业顾问将与您详细沟通，确认职位要求和期望</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">发布职位</h3>
                  <p className="text-gray-600">职位信息将在平台上发布，吸引优质推荐人关注</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">人才推荐</h3>
                  <p className="text-gray-600">接收精准匹配的候选人推荐，快速找到合适人才</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 底部说明 */}
        <div className="mt-8 text-center text-gray-600">
          <p>期待与您的合作，共同创造更大的价值</p>
        </div>
      </div>
    </div>
  )
}