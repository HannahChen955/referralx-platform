export interface LevelInfo {
  name: string
  minPoints: number
  maxPoints: number
  color: string
  icon: string
  privileges: string[]
  bonusRate: number // 奖金加成比例
}

export const LEVEL_SYSTEM: LevelInfo[] = [
  {
    name: "慧眼新人",
    minPoints: 0,
    maxPoints: 499,
    color: "gray",
    icon: "🌟",
    privileges: ["基础推荐权限"],
    bonusRate: 0
  },
  {
    name: "识人有术", 
    minPoints: 500,
    maxPoints: 1499,
    color: "blue",
    icon: "🔍",
    privileges: ["优先展示推荐", "专属标识"],
    bonusRate: 0
  },
  {
    name: "伯乐千里",
    minPoints: 1500,
    maxPoints: 4999,
    color: "purple",
    icon: "🏃",
    privileges: ["内推绿色通道", "奖金+5%"],
    bonusRate: 0.05
  },
  {
    name: "百里挑一",
    minPoints: 5000,
    maxPoints: 9999,
    color: "orange",
    icon: "💎",
    privileges: ["企业直通车", "奖金+10%"],
    bonusRate: 0.10
  },
  {
    name: "慧眼识珠",
    minPoints: 10000,
    maxPoints: Number.MAX_SAFE_INTEGER,
    color: "gold",
    icon: "👑",
    privileges: ["平台合伙人", "奖金+15%"],
    bonusRate: 0.15
  }
]

export function getLevelByPoints(points: number): LevelInfo {
  return LEVEL_SYSTEM.find(level => 
    points >= level.minPoints && points <= level.maxPoints
  ) || LEVEL_SYSTEM[0]
}

export function getPointsForNextLevel(points: number): number | null {
  const currentLevel = getLevelByPoints(points)
  const nextLevel = LEVEL_SYSTEM.find(level => level.minPoints > currentLevel.maxPoints)
  return nextLevel ? nextLevel.minPoints - points : null
}

export function getLevelProgress(points: number): number {
  const level = getLevelByPoints(points)
  if (level.maxPoints === Number.MAX_SAFE_INTEGER) return 100
  
  const progress = ((points - level.minPoints) / (level.maxPoints - level.minPoints)) * 100
  return Math.min(Math.max(progress, 0), 100)
}

export function calculateLevelBonusAmount(baseAmount: number, points: number): number {
  const level = getLevelByPoints(points)
  return baseAmount * level.bonusRate
}

export const POINTS_SYSTEM = {
  RESUME_PASSED: 100,     // 简历通过初筛
  INTERVIEW_SCHEDULED: 200, // 安排面试
  OFFER_RECEIVED: 500,    // 获得Offer
  HIRED: 1000,           // 成功入职
  PROFILE_COMPLETE: 50,   // 完善资料
  CONSECUTIVE_BONUS: 50   // 连续推荐奖励
} as const