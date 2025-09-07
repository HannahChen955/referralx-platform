'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface RewardStage {
  stage: string
  description: string
  processReward: number
  points: number
  requirements: string[]
  timeframe?: string
}

interface RewardExplanationProps {
  job: {
    salaryMin?: number | null
    salaryMax?: number | null
    commissionRate: number
    referrerShareRate: number
  }
}

const rewardStages: RewardStage[] = [
  {
    stage: '简历提交',
    description: '候选人简历通过平台提交给企业',
    processReward: 0,
    points: 100,
    requirements: [
      '简历信息完整准确',
      '符合职位基本要求',
      '候选人同意推荐'
    ],
    timeframe: '立即获得积分'
  },
  {
    stage: 'HR初筛',
    description: '企业HR对简历进行初步筛选通过',
    processReward: 0,
    points: 200,
    requirements: [
      '简历通过HR初步审核',
      '候选人背景符合岗位要求',
      '无明显不匹配因素'
    ],
    timeframe: '3-5个工作日'
  },
  {
    stage: '面试通过',
    description: '候选人成功通过企业面试',
    processReward: 200,
    points: 300,
    requirements: [
      '候选人接受面试邀请',
      '按时参加面试',
      '成功通过面试评估'
    ],
    timeframe: '面试结果确认后'
  },
  {
    stage: 'Offer接受',
    description: '候选人接受企业发出的正式工作Offer',
    processReward: 500,
    points: 500,
    requirements: [
      '候选人通过面试评估',
      '薪资待遇谈判达成一致',
      '企业正式发出Offer',
      '候选人书面接受Offer'
    ],
    timeframe: 'Offer发出后确认接受'
  },
  {
    stage: '成功入职过保',
    description: '候选人正式入职并通过试用期考核',
    processReward: 0,
    points: 1500,
    requirements: [
      '候选人接受Offer并入职',
      '完成入职手续，正式开始工作',
      '试用期表现合格，通过企业考核',
      '转为正式员工'
    ],
    timeframe: '入职后3-6个月确认'
  }
]

export default function RewardExplanation({ job }: RewardExplanationProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 计算最终佣金奖励
  const calculateFinalCommission = () => {
    if (!job.salaryMin || !job.salaryMax) return null
    
    const minAnnualSalary = job.salaryMin * 12
    const maxAnnualSalary = job.salaryMax * 12
    
    const minCommission = minAnnualSalary * job.commissionRate * job.referrerShareRate
    const maxCommission = maxAnnualSalary * job.commissionRate * job.referrerShareRate
    
    return {
      min: Math.round(minCommission),
      max: Math.round(maxCommission)
    }
  }
  
  const finalCommission = calculateFinalCommission()
  const totalProcessReward = rewardStages.reduce((sum, stage) => sum + stage.processReward, 0)
  
  // 防止hydration不匹配
  if (!mounted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-800">推荐奖励总览</h3>
          </div>
          <div className="text-center">
            <div className="text-lg text-green-700">加载中...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* 奖励概览 */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-800">推荐奖励总览</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetail(!showDetail)}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              {showDetail ? '收起详情' : '查看详情'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                ¥{totalProcessReward}
              </div>
              <div className="text-sm text-green-600">过程奖励</div>
              <div className="text-xs text-gray-500 mt-1">分阶段发放</div>
            </div>
            
            {finalCommission && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  ¥{finalCommission.min}-{finalCommission.max}
                </div>
                <div className="text-sm text-green-600">成功奖励</div>
                <div className="text-xs text-gray-500 mt-1">入职后发放</div>
              </div>
            )}
          </div>
          
          {finalCommission && (
            <div className="mt-3 text-center">
              <div className="text-lg font-semibold text-green-800">
                总奖励最高: ¥{totalProcessReward + finalCommission.max}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 详细阶段说明 */}
      {showDetail && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-900">奖励发放详情</h4>
          
          {rewardStages.map((stage, index) => (
            <Card key={index} className="border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{stage.stage}</h5>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {stage.processReward > 0 && (
                      <div className="text-lg font-bold text-green-600">
                        +¥{stage.processReward}
                      </div>
                    )}
                    {stage.stage === '成功入职过保' && finalCommission && (
                      <div className="text-lg font-bold text-green-600">
                        +¥{finalCommission.min}-{finalCommission.max}
                      </div>
                    )}
                    <div className="text-sm text-blue-600">+{stage.points}积分</div>
                    {stage.timeframe && (
                      <div className="text-xs text-gray-500 mt-1">{stage.timeframe}</div>
                    )}
                  </div>
                </div>
                
                <div className="ml-11">
                  <h6 className="text-sm font-medium text-gray-700 mb-1">完成条件:</h6>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {stage.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* 积分等级说明 */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <h5 className="font-semibold text-purple-800 mb-3">伯乐等级系统</h5>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-purple-700">慧眼新人</div>
                  <div className="text-purple-600">0-999积分</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-700">识人有术</div>
                  <div className="text-purple-600">1000-2999积分</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-700">伯乐千里</div>
                  <div className="text-purple-600">3000-6999积分</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-700">百里挑一</div>
                  <div className="text-purple-600">7000-14999积分</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-700">慧眼识珠</div>
                  <div className="text-purple-600">15000+积分</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 重要提醒 */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <h5 className="font-semibold text-amber-800 mb-2">重要提醒</h5>
              <div className="text-sm text-amber-700 space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⚠</span>
                  <span>简历提交和HR初筛阶段仅获得积分奖励，无现金奖励</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">💰</span>
                  <span>过程奖励在面试通过以及Offer书面接受阶段发放，最大奖励只在候选人成功通过试用期后发放，确保推荐人无风险</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⚠</span>
                  <span>现金奖励在各阶段完成确认后3个工作日内发放</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">⚠</span>
                  <span>试用期内离职无最终奖励，但前期过程奖励不受影响</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}