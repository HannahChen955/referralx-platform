'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import RewardExplanation from '@/components/RewardExplanation'

interface JobDetail {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number | null
  salaryMax?: number | null
  description: string
  requirements?: string | null
  benefits?: string | null
  referralLimit: number
  currentReferralCount: number
  commissionRate: number
  referrerShareRate: number
  createdAt: string
  updatedAt: string
  _count: {
    referrals: number
  }
  referrals: Array<{
    id: string
    candidateName: string
    status: string
    createdAt: string
    isAnonymous: boolean
    user: {
      name: string
    }
  }>
}

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchJobDetail()
    }
  }, [id])

  const fetchJobDetail = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/jobs/${id}`)
      const data = await res.json()

      if (data.success) {
        setJob(data.data)
      } else {
        setError(data.error || '职位不存在')
      }
    } catch (err) {
      console.error('获取职位详情失败:', err)
      setError('获取职位详情失败')
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'SUBMITTED': '已提交',
      'RECRUITER_REVIEW': 'HR筛选中',
      'INTERVIEW_SCHEDULED': '面试安排中',
      'OFFER_MADE': '已发Offer',
      'HIRED': '已入职',
      'PROBATION_PASSED': '试用期通过',
      'REJECTED': '未通过'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'SUBMITTED': 'text-blue-600 bg-blue-50',
      'RECRUITER_REVIEW': 'text-yellow-600 bg-yellow-50',
      'INTERVIEW_SCHEDULED': 'text-purple-600 bg-purple-50',
      'OFFER_MADE': 'text-green-600 bg-green-50',
      'HIRED': 'text-green-700 bg-green-100',
      'PROBATION_PASSED': 'text-green-800 bg-green-200',
      'REJECTED': 'text-red-600 bg-red-50'
    }
    return colorMap[status] || 'text-gray-600 bg-gray-50'
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

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="mt-4 text-gray-600">{error}</p>
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

  const referralCount = job._count.referrals
  const isHot = referralCount > 5
  
  // 计算推荐奖金范围
  const calculateRewardRange = () => {
    if (!job.salaryMin || !job.salaryMax) return null
    
    const minAnnualSalary = job.salaryMin * 12
    const maxAnnualSalary = job.salaryMax * 12
    const processReward = 700 // 过程奖励总和：100+200+200+200
    
    const minCommission = minAnnualSalary * job.commissionRate * job.referrerShareRate
    const maxCommission = maxAnnualSalary * job.commissionRate * job.referrerShareRate
    
    return {
      min: Math.round(minCommission + processReward),
      max: Math.round(maxCommission + processReward)
    }
  }
  
  const rewardRange = calculateRewardRange()

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 职位基本信息 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-1 4h1m-1 4h1" />
                      </svg>
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isHot ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      已推荐 {referralCount} 人
                    </span>
                    {isHot && (
                      <span className="text-sm text-orange-600">🔥 热门职位</span>
                    )}
                    {referralCount < 3 && (
                      <span className="text-sm text-green-600">✨ 机会较大</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {job.salaryMin && job.salaryMax && (
                    <div className="text-2xl font-bold text-primary-600">
                      ¥{job.salaryMin / 1000}-{job.salaryMax / 1000}K/月
                    </div>
                  )}
                  <div className="text-lg font-bold text-green-600 mt-2">
                    推荐奖金：{rewardRange ? `最高¥${rewardRange.max}` : '面议'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 职位描述 */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">职位描述</h2>
              <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </CardContent>
          </Card>

          {/* 任职要求 */}
          {job.requirements && (
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">任职要求</h2>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 福利待遇 */}
          {job.benefits && (
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">福利待遇</h2>
                <div className="text-gray-600 leading-relaxed">
                  {job.benefits}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 推荐按钮 */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {referralCount}
                  </div>
                  <div className="text-sm text-gray-500">当前推荐人数</div>
                </div>
                <Link href={`/referral/${job.id}`}>
                  <Button 
                    size="lg" 
                    className="w-full mb-3"
                  >
                    立即推荐
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">
                  成功推荐最高可获得 {rewardRange ? `¥${rewardRange.max}` : '丰厚'} 奖励
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 最近推荐 */}
          {job.referrals.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">最近推荐</h3>
                <div className="space-y-3">
                  {job.referrals.slice(0, 5).map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {referral.isAnonymous ? '匿名推荐' : referral.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                        {getStatusText(referral.status)}
                      </span>
                    </div>
                  ))}
                </div>
                {job.referrals.length > 5 && (
                  <div className="mt-3 text-center">
                    <Button variant="outline" size="sm">
                      查看更多推荐
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 推荐奖励说明 */}
          <RewardExplanation job={job} />
        </div>
      </div>
    </div>
  )
}