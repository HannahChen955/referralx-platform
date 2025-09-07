'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface JobDetail {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number | null
  salaryMax?: number | null
  description: string
  requirements: string
  benefits?: string | null
  commissionRate: number
  referrerShareRate: number
  isActive: boolean
  createdAt: string
  _count: {
    referrals: number
  }
  referrals: Array<{
    id: string
    candidateName: string
    candidatePhone: string
    candidateEmail?: string | null
    status: string
    createdAt: string
    isAnonymous: boolean
    user: {
      name: string
      phone: string
    }
  }>
}

export default function EditJobPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    benefits: '',
    commissionRate: '',
    referrerShareRate: '',
    isActive: true
  })

  useEffect(() => {
    if (id) {
      fetchJob()
    }
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/jobs/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      const data = await res.json()

      if (data.success) {
        const jobData = data.data
        setJob(jobData)
        setFormData({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          salaryMin: jobData.salaryMin?.toString() || '',
          salaryMax: jobData.salaryMax?.toString() || '',
          description: jobData.description,
          requirements: jobData.requirements,
          benefits: jobData.benefits || '',
          commissionRate: jobData.commissionRate.toString(),
          referrerShareRate: jobData.referrerShareRate.toString(),
          isActive: jobData.isActive
        })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (error) setError('')
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.company || !formData.location || !formData.description || !formData.requirements) {
      setError('请填写所有必填信息')
      return
    }

    if (formData.salaryMin && formData.salaryMax && parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      setError('最低薪资不能大于或等于最高薪资')
      return
    }

    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
      } else {
        setError(data.error || '更新职位失败')
      }
    } catch (err) {
      console.error('更新职位失败:', err)
      setError('网络错误，请重试')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'SUBMITTED': 'bg-blue-100 text-blue-800',
      'RECRUITER_REVIEW': 'bg-yellow-100 text-yellow-800',
      'INTERVIEW_SCHEDULED': 'bg-purple-100 text-purple-800',
      'OFFER_MADE': 'bg-green-100 text-green-800',
      'HIRED': 'bg-green-200 text-green-900',
      'PROBATION_PASSED': 'bg-green-300 text-green-900',
      'REJECTED': 'bg-red-100 text-red-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/admin')}
          >
            返回管理后台
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary-600 mr-8">
                ReferralX
              </div>
              <h1 className="text-xl font-semibold text-gray-700">编辑职位</h1>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              返回管理后台
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 编辑表单 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* 职位状态 */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">职位在线（勾选表示职位可见）</span>
                    </label>
                  </div>

                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        职位名称 *
                      </label>
                      <Input
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          公司名称 *
                        </label>
                        <Input
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          工作地点 *
                        </label>
                        <Input
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          最低月薪 (元)
                        </label>
                        <Input
                          name="salaryMin"
                          type="number"
                          value={formData.salaryMin}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          最高月薪 (元)
                        </label>
                        <Input
                          name="salaryMax"
                          type="number"
                          value={formData.salaryMax}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 职位详情 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">职位详情</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        职位描述 *
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={6}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        任职要求 *
                      </label>
                      <textarea
                        name="requirements"
                        required
                        rows={6}
                        value={formData.requirements}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        福利待遇
                      </label>
                      <textarea
                        name="benefits"
                        rows={3}
                        value={formData.benefits}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* 推荐奖励设置 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">推荐奖励设置</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          企业佣金比例
                        </label>
                        <Input
                          name="commissionRate"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={formData.commissionRate}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          企业支付的佣金比例 (如: 0.15 = 15%)
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          推荐人分成比例
                        </label>
                        <Input
                          name="referrerShareRate"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={formData.referrerShareRate}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          推荐人获得的佣金分成 (如: 0.60 = 60%)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin')}
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? '保存中...' : '保存更改'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 右侧信息栏 */}
          <div className="space-y-6">
            {/* 职位统计 */}
            {job && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">职位统计</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">推荐总数</span>
                      <span className="text-sm font-medium">{job._count.referrals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">职位状态</span>
                      <span className={`text-sm font-medium ${job.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {job.isActive ? '在线' : '已下线'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">创建时间</span>
                      <span className="text-sm text-gray-900">
                        {new Date(job.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 推荐记录 */}
            {job && job.referrals.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">最近推荐</h3>
                  <div className="space-y-3">
                    {job.referrals.slice(0, 5).map((referral) => (
                      <div key={referral.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm font-medium text-gray-900">
                            {referral.candidateName}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(referral.status)}`}>
                            {getStatusText(referral.status)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          推荐人: {referral.isAnonymous ? '匿名' : referral.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}