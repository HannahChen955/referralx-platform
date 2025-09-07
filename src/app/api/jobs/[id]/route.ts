import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const job = await prisma.job.findUnique({
      where: { 
        id,
        isActive: true 
      },
      include: {
        _count: {
          select: { referrals: true }
        },
        referrals: {
          where: { status: { not: 'REJECTED' } },
          select: {
            id: true,
            candidateName: true,
            status: true,
            createdAt: true,
            isAnonymous: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { 
          success: false, 
          error: '职位不存在或已下线' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: job
    })

  } catch (error) {
    console.error('获取职位详情失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取职位详情失败' 
      },
      { status: 500 }
    )
  }
}