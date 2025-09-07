import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const company = searchParams.get('company') || ''

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      isActive: true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (company) {
      where.company = { contains: company, mode: 'insensitive' }
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