import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface JobCardProps {
  job: {
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
}

export function JobCard({ job }: JobCardProps) {
  const referralCount = job._count?.referrals || job.currentReferralCount
  const isHot = referralCount > 5

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-1 4h1m-1 4h1" />
                </svg>
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            </div>
          </div>
          <div className="text-right">
            {job.salaryMin && job.salaryMax && (
              <div className="text-lg font-semibold text-primary-600">
                ¥{job.salaryMin / 1000}-{job.salaryMax / 1000}K/月
              </div>
            )}
            <div className="text-sm font-medium text-green-600 mt-1">
              推荐奖金：最高¥25,700
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isHot ? 'bg-orange-100 text-orange-800' : 
              'bg-green-100 text-green-800'
            }`}>
              已推荐 {referralCount} 人
            </span>
            {isHot && (
              <span className="text-xs text-orange-600">🔥 热门职位</span>
            )}
            {referralCount < 3 && (
              <span className="text-xs text-green-600">✨ 机会较大</span>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/jobs/${job.id}`}>
              <Button variant="outline" size="sm">
                查看详情
              </Button>
            </Link>
            <Link href={`/referral/${job.id}`}>
              <Button size="sm">
                立即推荐
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}