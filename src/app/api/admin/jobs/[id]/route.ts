import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAdminFromRequest } from '@/lib/admin-auth'

// 获取单个职位详情（管理员视图）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }
    const { id } = await params

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: { referrals: true }
        },
        referrals: {
          select: {
            id: true,
            candidateName: true,
            candidatePhone: true,
            candidateEmail: true,
            status: true,
            createdAt: true,
            isAnonymous: true,
            user: {
              select: {
                name: true,
                phone: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { 
          success: false, 
          error: '职位不存在' 
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

// 更新职位
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }
    const { id } = await params
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
      referrerShareRate,
      isActive
    } = await request.json()

    // 验证职位是否存在
    const existingJob = await prisma.job.findUnique({
      where: { id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { 
          success: false, 
          error: '职位不存在' 
        },
        { status: 404 }
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

    // 更新职位
    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        company,
        location,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        description,
        requirements,
        benefits: benefits || null,
        commissionRate: commissionRate ? parseFloat(commissionRate) : existingJob.commissionRate,
        referrerShareRate: referrerShareRate ? parseFloat(referrerShareRate) : existingJob.referrerShareRate,
        isActive: isActive !== undefined ? isActive : existingJob.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: job
    })

  } catch (error) {
    console.error('更新职位失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '更新职位失败' 
      },
      { status: 500 }
    )
  }
}

// 删除职位（软删除，设为inactive）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }
    const { id } = await params

    // 验证职位是否存在
    const existingJob = await prisma.job.findUnique({
      where: { id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { 
          success: false, 
          error: '职位不存在' 
        },
        { status: 404 }
      )
    }

    // 软删除（设为inactive）
    await prisma.job.update({
      where: { id },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({
      success: true,
      message: '职位已下线'
    })

  } catch (error) {
    console.error('删除职位失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '删除职位失败' 
      },
      { status: 500 }
    )
  }
}