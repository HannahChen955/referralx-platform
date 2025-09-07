'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getUser, requireAuth } from '@/lib/auth'
import { checkSensitiveInfo, generateDesensitizationHint } from '@/lib/data-sensitivity'

interface JobInfo {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number | null
  salaryMax?: number | null
}

export default function ReferralPage() {
  const { jobId } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // 推荐类型状态
  const [referralType, setReferralType] = useState<'QUICK_SCREENING' | 'FORMAL'>('QUICK_SCREENING')
  const [showReferralTypeSelection, setShowReferralTypeSelection] = useState(true)
  
  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    candidateEmail: '',
    reason: '',
    isAnonymous: false,
    // 快速初筛专用字段
    industry: '',
    experience: '',
    skills: '',
    education: '',
    location: '',
    matchReason: ''
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  
  // 敏感信息检测
  const [sensitiveInfoWarning, setSensitiveInfoWarning] = useState<string | null>(null)

  useEffect(() => {
    // 检查用户登录状态
    if (!requireAuth()) {
      return
    }
    
    if (jobId) {
      fetchJobInfo()
    }
  }, [jobId])

  const fetchJobInfo = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/jobs/${jobId}`)
      const data = await res.json()

      if (data.success) {
        setJob(data.data)
      } else {
        setError(data.error || '职位不存在')
      }
    } catch (err) {
      console.error('获取职位信息失败:', err)
      setError('获取职位信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // 快速初筛模式下检测敏感信息
    if (referralType === 'QUICK_SCREENING' && typeof value === 'string') {
      const hint = generateDesensitizationHint(value)
      setSensitiveInfoWarning(hint)
    }
    
    // 清除错误信息
    if (error) setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 验证文件类型和大小
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setError('请上传PDF或Word格式的简历')
        return
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB限制
        setError('简历文件大小不能超过10MB')
        return
      }
      
      setResumeFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const user = getUser()
    if (!user) {
      setError('请先登录')
      return
    }

    // 根据推荐类型进行不同的验证
    if (referralType === 'QUICK_SCREENING') {
      // 快速初筛验证
      if (!formData.industry || !formData.experience || !formData.skills || !formData.matchReason) {
        setError('请填写所有必填信息')
        return
      }
      
      if (formData.matchReason.length < 20) {
        setError('匹配理由至少需要20个字符')
        return
      }

      // 检测是否包含敏感信息
      const allText = `${formData.industry} ${formData.skills} ${formData.matchReason}`
      const sensitiveCheck = checkSensitiveInfo(allText)
      if (sensitiveCheck.hasSensitiveInfo) {
        setError('检测到敏感信息，请按提示修改后再提交')
        return
      }
    } else {
      // 正式推荐验证
      if (!formData.candidateName || !formData.candidatePhone || !formData.reason) {
        setError('请填写所有必填信息')
        return
      }

      if (formData.reason.length < 20) {
        setError('推荐理由至少需要20个字符，请详细描述候选人的优势')
        return
      }
    }

    setSubmitting(true)
    setError('')

    try {
      const submitFormData = new FormData()
      submitFormData.append('jobId', jobId as string)
      submitFormData.append('userId', user.id)
      submitFormData.append('referralType', referralType)
      
      if (referralType === 'QUICK_SCREENING') {
        // 快速初筛字段
        submitFormData.append('candidateName', '候选人') // 脱敏处理
        submitFormData.append('candidatePhone', '') // 不提交敏感信息
        submitFormData.append('candidateEmail', '')
        submitFormData.append('industry', formData.industry)
        submitFormData.append('experience', formData.experience)
        submitFormData.append('skills', formData.skills)
        submitFormData.append('education', formData.education)
        submitFormData.append('location', formData.location)
        submitFormData.append('reason', formData.matchReason)
        submitFormData.append('isDesensitized', 'true')
      } else {
        // 正式推荐字段
        submitFormData.append('candidateName', formData.candidateName)
        submitFormData.append('candidatePhone', formData.candidatePhone)
        submitFormData.append('candidateEmail', formData.candidateEmail)
        submitFormData.append('reason', formData.reason)
        submitFormData.append('isDesensitized', 'false')
        
        if (resumeFile) {
          submitFormData.append('resume', resumeFile)
        }
      }
      
      submitFormData.append('isAnonymous', formData.isAnonymous.toString())

      const res = await fetch('/api/referral', {
        method: 'POST',
        body: submitFormData
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || '提交推荐失败')
      }
    } catch (err) {
      console.error('提交推荐失败:', err)
      setError('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/jobs')}
          >
            返回职位列表
          </Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">推荐提交成功！</h2>
              <p className="text-gray-600 mb-6">
                您的推荐已成功提交给 <span className="font-medium">{job?.company}</span>，
                HR会尽快审核候选人简历。
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/referral/dashboard')} 
                  className="w-full sm:w-auto"
                >
                  查看我的推荐
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/jobs')} 
                  className="w-full sm:w-auto ml-0 sm:ml-3"
                >
                  继续推荐其他职位
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 推荐类型选择界面
  if (showReferralTypeSelection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">选择推荐方式</h1>
            <p className="text-lg text-gray-600">
              根据您的情况选择合适的推荐方式
            </p>
          </div>

          {/* 职位信息卡片 */}
          {job && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{job.title}</h2>
                <p className="text-blue-800">{job.company} · {job.location}</p>
                {job.salaryMin && job.salaryMax && (
                  <p className="text-blue-700 mt-1">
                    ¥{job.salaryMin / 1000}-{job.salaryMax / 1000}K/月
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 快速初筛 */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">快速初筛</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    还没联系候选人？先提交脱敏信息让平台评估匹配度
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>无需提供姓名、电话等敏感信息</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>平台人工评估匹配度并反馈</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>匹配度高可转为正式推荐</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">i</span>
                    <span>适合试探性推荐</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setReferralType('QUICK_SCREENING')
                    setShowReferralTypeSelection(false)
                  }}
                  className="w-full mt-6"
                  variant="outline"
                >
                  选择快速初筛
                </Button>
              </CardContent>
            </Card>

            {/* 正式推荐 */}
            <Card className="relative overflow-hidden border-2 border-green-200">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs">
                推荐
              </div>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">正式推荐</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    已获得候选人同意？直接提交完整信息快速对接
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>提交完整候选人信息和简历</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>直接进入HR面试流程</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>获得完整奖励（最高¥25,700）</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">!</span>
                    <span className="text-red-600">需要候选人明确授权</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setReferralType('FORMAL')
                    setShowReferralTypeSelection(false)
                  }}
                  className="w-full mt-6"
                >
                  选择正式推荐
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>💡 提示：选择后仍可返回重新选择推荐方式</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowReferralTypeSelection(true)}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            重新选择推荐方式
          </Button>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-sm">
            {referralType === 'QUICK_SCREENING' ? (
              <>
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-yellow-700">快速初筛</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-700">正式推荐</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">推荐人才</h1>
                
                {/* 职位信息摘要 */}
                {job && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-900 mb-2">推荐职位</h3>
                    <div className="text-blue-800">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm">{job.company} · {job.location}</div>
                      {job.salaryMin && job.salaryMax && (
                        <div className="text-sm">
                          ¥{job.salaryMin / 1000}-{job.salaryMax / 1000}K/月
                        </div>
                      )}
                      <div className="text-sm font-medium text-green-700 mt-1">
                        推荐奖金：最高¥25,700
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* 敏感信息警告 */}
                  {sensitiveInfoWarning && referralType === 'QUICK_SCREENING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <p className="text-sm text-yellow-800 font-medium">敏感信息提醒</p>
                          <div className="text-xs text-yellow-700 mt-1 whitespace-pre-line">{sensitiveInfoWarning}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {referralType === 'QUICK_SCREENING' ? (
                    /* 快速初筛表单 */
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">候选人概况（脱敏信息）</h3>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">快速初筛说明</p>
                            <p>请提供脱敏的候选人信息，不要包含姓名、电话、邮箱等敏感信息。系统会自动检测并提示您调整。</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            行业方向 *
                          </label>
                          <Input
                            name="industry"
                            required
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="如：互联网、金融、制造业"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            工作年限 *
                          </label>
                          <Input
                            name="experience"
                            required
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="如：5年、3-5年"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          技能亮点 *
                        </label>
                        <Input
                          name="skills"
                          required
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="如：React开发、项目管理、数据分析"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            学历层级
                          </label>
                          <Input
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            placeholder="如：本科、硕士、博士"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            所在城市
                          </label>
                          <Input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="如：北京、上海、深圳"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          匹配理由 *
                        </label>
                        <textarea
                          name="matchReason"
                          required
                          rows={5}
                          value={formData.matchReason}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="请描述候选人与职位的匹配点，如技能匹配、经验匹配等。避免提及具体姓名或联系方式。"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          当前字数: {formData.matchReason.length} (至少需要20个字符)
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* 正式推荐表单 */
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">候选人信息</h3>
                      
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-green-800">
                            <p className="font-medium">已确认候选人授权</p>
                            <p>提交此表单即表示您已获得候选人明确同意进行推荐。</p>
                          </div>
                        </div>
                      </div>
                    
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            姓名 *
                          </label>
                          <Input
                            name="candidateName"
                            required
                            value={formData.candidateName}
                            onChange={handleInputChange}
                            placeholder="请输入候选人姓名"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            手机号 *
                          </label>
                          <Input
                            name="candidatePhone"
                            type="tel"
                            required
                            value={formData.candidatePhone}
                            onChange={handleInputChange}
                            placeholder="请输入候选人手机号"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          邮箱 (可选)
                        </label>
                        <Input
                          name="candidateEmail"
                          type="email"
                          value={formData.candidateEmail}
                          onChange={handleInputChange}
                          placeholder="请输入候选人邮箱"
                        />
                      </div>

                      {/* 简历上传 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          简历文件 (可选)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          支持PDF、Word格式，文件大小不超过10MB
                        </p>
                      </div>

                      {/* 推荐理由 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          推荐理由 *
                        </label>
                        <textarea
                          name="reason"
                          required
                          rows={5}
                          value={formData.reason}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="请详细描述候选人的优势、工作经历、技能特长等，帮助HR更好地了解候选人。建议至少20个字符。"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          当前字数: {formData.reason.length} (建议至少20字符)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 候选人基本信息 */}
                  <div className="space-y-4" style={{display: 'none'}}>
                    <h3 className="text-lg font-medium text-gray-900">候选人信息</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          姓名 *
                        </label>
                        <Input
                          name="candidateName"
                          required
                          value={formData.candidateName}
                          onChange={handleInputChange}
                          placeholder="请输入候选人姓名"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          手机号 *
                        </label>
                        <Input
                          name="candidatePhone"
                          type="tel"
                          required
                          value={formData.candidatePhone}
                          onChange={handleInputChange}
                          placeholder="请输入候选人手机号"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱 (可选)
                      </label>
                      <Input
                        name="candidateEmail"
                        type="email"
                        value={formData.candidateEmail}
                        onChange={handleInputChange}
                        placeholder="请输入候选人邮箱"
                      />
                    </div>
                  </div>

                  {/* 简历上传 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      简历文件 (可选)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      支持PDF、Word格式，文件大小不超过10MB
                    </p>
                  </div>

                  {/* 推荐理由 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      推荐理由 *
                    </label>
                    <textarea
                      name="reason"
                      required
                      rows={5}
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="请详细描述候选人的优势、工作经历、技能特长等，帮助HR更好地了解候选人。建议至少20个字符。"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      当前字数: {formData.reason.length} (建议至少20字符)
                    </p>
                  </div>

                  {/* 匿名选项 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
                      匿名推荐（不向候选人透露我的身份）
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full"
                      size="lg"
                    >
                      {submitting 
                        ? '提交中...' 
                        : referralType === 'QUICK_SCREENING' 
                        ? '提交快速初筛' 
                        : '提交正式推荐'
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 推荐须知 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐须知</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>确保候选人同意被推荐</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>提供真实准确的信息</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>详细描述推荐理由</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>同一候选人只能推荐一次</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 奖励提醒 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">奖励提醒</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-800 mb-1">
                      ¥25,700
                    </div>
                    <div className="text-sm text-green-600 mb-3">
                      最高可得奖励
                    </div>
                    <div className="text-xs text-green-700 space-y-1">
                      <div>过程奖励：¥700 + 积分</div>
                      <div>成功佣金：¥15,000-25,000</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}