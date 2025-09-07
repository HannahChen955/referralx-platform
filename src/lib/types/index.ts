import { User, Job, Referral, ReferralProgress, ReferralStatus, ProgressStage } from '@prisma/client'

// 基础类型导出
export type { ReferralStatus, ProgressStage }

// 扩展类型
export interface JobWithStats extends Job {
  _count?: {
    referrals?: number
  }
}

export interface ReferralWithDetails extends Referral {
  job: Job
  user: User
  progressHistory: ReferralProgress[]
}

export interface UserProfile extends User {
  _count?: {
    referrals?: number
  }
}

// 表单类型
export interface LoginForm {
  phone: string
  verificationCode: string
}

export interface RegisterForm {
  phone: string
  name: string
  email?: string
  verificationCode: string
}

export interface ReferralForm {
  candidateName: string
  candidatePhone: string
  candidateEmail?: string
  reason: string
  resumeFile?: File
  isAnonymous: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 奖励阶段配置
export interface RewardStage {
  stage: ProgressStage
  amount: number
  description: string
}

export const REWARD_STAGES: RewardStage[] = [
  {
    stage: 'RECRUITER_REVIEW',
    amount: 200,
    description: '猎头初筛通过'
  },
  {
    stage: 'HR_INTERVIEW', 
    amount: 800,
    description: 'HR面试通过'
  },
  {
    stage: 'ONBOARD',
    amount: 2500,
    description: '候选人入职'
  },
  {
    stage: 'PROBATION',
    amount: 4000,
    description: '过保完成(3个月)'
  }
]