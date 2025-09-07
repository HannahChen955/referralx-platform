'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { adminAuth } from '@/lib/admin-auth'

interface JobSummary {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number | null
  salaryMax?: number | null
  isActive: boolean
  createdAt: string
  _count: {
    referrals: number
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, inactive
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalReferrals: 0
  })

  // 防止hydration不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  // 检查认证状态
  useEffect(() => {
    if (mounted && !adminAuth.isAuthenticated()) {
      router.push('/admin/login')
      return
    }
  }, [router, mounted])

  useEffect(() => {
    if (mounted && adminAuth.isAuthenticated()) {
      fetchJobs()
    }
  }, [filter, mounted])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: filter,
        limit: '50'
      })

      const token = adminAuth.getToken()
      const res = await fetch(`/api/admin/jobs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      
      if (data.success) {
        const jobsList = data.data.jobs
        setJobs(jobsList)
        // 计算统计数据
        const totalJobs = jobsList.length
        const activeJobs = jobsList.filter((job: JobSummary) => job.isActive).length
        const totalReferrals = jobsList.reduce((sum: number, job: JobSummary) => sum + job._count.referrals, 0)
        setStats({ totalJobs, activeJobs, totalReferrals })
      }
    } catch (error) {
      console.error('获取职位列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => {
    adminAuth.removeToken()
    router.push('/admin/login')
  }

  // 防止hydration不匹配
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const token = adminAuth.getToken()
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (res.ok) {
        fetchJobs() // 重新获取数据
      }
    } catch (error) {
      console.error('更新职位状态失败:', error)
    }
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
              <h1 className="text-xl font-semibold text-gray-700">管理后台</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/jobs/new">
                <Button>+ 发布新职位</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">总职位数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a2 2 0 01-.667 1.485L16 20.5 12 19l-4 1.5-3.333-4.721A2 2 0 014 14.809V8a2 2 0 012-2V6h10z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">在线职位</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">总推荐数</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalReferrals}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索职位名称或公司..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  全部
                </Button>
                <Button
                  variant={filter === 'active' ? 'primary' : 'outline'}
                  onClick={() => setFilter('active')}
                >
                  在线
                </Button>
                <Button
                  variant={filter === 'inactive' ? 'primary' : 'outline'}
                  onClick={() => setFilter('inactive')}
                >
                  已下线
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 职位列表 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      职位信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      薪资范围
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      推荐数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        加载中...
                      </td>
                    </tr>
                  ) : filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        暂无职位数据
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.company} · {job.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {job.salaryMin && job.salaryMax ? 
                            `¥${job.salaryMin / 1000}-${job.salaryMax / 1000}K/月` : 
                            '面议'
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {job._count.referrals}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            job.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {job.isActive ? '在线' : '已下线'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                          <Link 
                            href={`/admin/jobs/${job.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => toggleJobStatus(job.id, job.isActive)}
                            className={`${
                              job.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {job.isActive ? '下线' : '上线'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}