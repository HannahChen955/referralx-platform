import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAdminFromRequest } from '@/lib/admin-auth'

// 获取所有职位（管理员视图）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'all' // all, active, inactive

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // 获取职位列表和总数
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { referrals: true }
          }
        }
      }),
      prisma.job.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取职位列表失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取职位列表失败' 
      },
      { status: 500 }
    )
  }
}

// 创建新职位
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }
    const {
      title,
      company,
      location,
      salaryMin,
      salaryMax,
      description,
      requirements,
      benefits,
      commissionRate,
      referrerShareRate
    } = await request.json()

    // 验证必填字段
    if (!title || !company || !location || !description || !requirements) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请填写所有必填信息' 
        },
        { status: 400 }
      )
    }

    // 验证薪资范围
    if (salaryMin && salaryMax && salaryMin >= salaryMax) {
      return NextResponse.json(
        { 
          success: false, 
          error: '最低薪资不能大于或等于最高薪资' 
        },
        { status: 400 }
      )
    }

    // 创建职位
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        description,
        requirements,
        benefits: benefits || null,
        commissionRate: commissionRate ? parseFloat(commissionRate) : 0.15,
        referrerShareRate: referrerShareRate ? parseFloat(referrerShareRate) : 0.60,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: job
    })

  } catch (error) {
    console.error('创建职位失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '创建职位失败' 
      },
      { status: 500 }
    )
  }
}