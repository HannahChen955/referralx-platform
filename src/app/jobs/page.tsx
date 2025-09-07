'use client'

import { useState, useEffect } from 'react'
import { JobCard } from '@/components/JobCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number | null
  salaryMax?: number | null
  description: string
  currentReferralCount: number
  referralLimit: number
  _count?: {
    referrals: number
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(location && { location })
      })
      
      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setJobs(data.data.jobs)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('获取职位列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchJobs()
  }

  // 获取所有唯一的城市
  const cities = Array.from(new Set(jobs.map(job => job.location)))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          热门职位推荐
        </h1>
        <p className="text-gray-600">
          发现优质职位机会，推荐合适的人才，获得丰厚奖励
        </p>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="搜索职位名称或关键词..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">所有城市</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="深圳">深圳</option>
              <option value="广州">广州</option>
              <option value="杭州">杭州</option>
              <option value="成都">成都</option>
              <option value="苏州">苏州</option>
              <option value="东莞">东莞</option>
              <option value="惠州">惠州</option>
            </select>
          </div>
          <div>
            <Button onClick={handleSearch} className="w-full">
              搜索职位
            </Button>
          </div>
        </div>

        {/* 推荐提示 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 <strong>小提示：</strong>
            推荐较少的职位成功机会更大！查看带有&ldquo;✨ 机会较大&rdquo;标签的职位。
          </p>
        </div>
      </div>

      {/* 职位列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="mt-4 text-gray-600">暂无职位信息</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                上一页
              </Button>
              <span className="flex items-center px-4">
                第 {page} / {totalPages} 页
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}