'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    commissionRate: '0.15', // 15%
    referrerShareRate: '0.60' // 60%
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (error) setError('')
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

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
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
        setError(data.error || '创建职位失败')
      }
    } catch (err) {
      console.error('创建职位失败:', err)
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const calculateEstimatedReward = () => {
    const minSalary = parseInt(formData.salaryMin) || 0
    const maxSalary = parseInt(formData.salaryMax) || 0
    const commissionRate = parseFloat(formData.commissionRate) || 0.15
    const referrerShareRate = parseFloat(formData.referrerShareRate) || 0.60

    if (minSalary && maxSalary) {
      const minCommission = minSalary * 12 * commissionRate * referrerShareRate
      const maxCommission = maxSalary * 12 * commissionRate * referrerShareRate
      return { min: Math.round(minCommission), max: Math.round(maxCommission) }
    }
    return null
  }

  const estimatedReward = calculateEstimatedReward()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary-600 mr-8">
                ReferralX
              </div>
              <h1 className="text-xl font-semibold text-gray-700">发布新职位</h1>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要表单 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

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
                        placeholder="如：高级前端工程师"
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
                          placeholder="如：阿里巴巴"
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
                          placeholder="如：杭州"
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
                          placeholder="如：20000"
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
                          placeholder="如：40000"
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
                        placeholder="详细描述职位职责、工作内容等..."
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
                        placeholder="详细描述任职要求、技能要求等..."
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
                        placeholder="描述公司福利待遇..."
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
                        <div className="relative">
                          <Input
                            name="commissionRate"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={formData.commissionRate}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span className="text-gray-500 text-sm">× 年薪</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          企业支付的佣金比例 (如: 0.15 = 15%)
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          推荐人分成比例
                        </label>
                        <div className="relative">
                          <Input
                            name="referrerShareRate"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={formData.referrerShareRate}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span className="text-gray-500 text-sm">× 佣金</span>
                          </div>
                        </div>
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
                      disabled={loading}
                    >
                      {loading ? '发布中...' : '发布职位'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏预览 */}
          <div className="space-y-6">
            {/* 预览卡片 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">职位预览</h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      {formData.title || '职位名称'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.company || '公司名称'} · {formData.location || '工作地点'}
                    </div>
                  </div>
                  
                  {(formData.salaryMin && formData.salaryMax) && (
                    <div className="text-lg font-semibold text-primary-600">
                      ¥{parseInt(formData.salaryMin) / 1000}-{parseInt(formData.salaryMax) / 1000}K/月
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 奖励计算器 */}
            {estimatedReward && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐奖励预估</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-800 mb-1">
                        ¥{estimatedReward.min.toLocaleString()}-{estimatedReward.max.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">
                        成功推荐奖励范围
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-green-700">
                      <div>企业佣金: {(parseFloat(formData.commissionRate) * 100).toFixed(0)}% × 年薪</div>
                      <div>推荐分成: {(parseFloat(formData.referrerShareRate) * 100).toFixed(0)}% × 佣金</div>
                      <div>加上过程奖励: ¥700</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 发布须知 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">发布须知</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>确保职位信息真实准确</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>薪资范围符合市场标准</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>推荐奖励设置合理</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>职位发布后立即生效</span>
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