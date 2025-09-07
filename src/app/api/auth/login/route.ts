import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const { phone, name, email } = await request.json()

    if (!phone || !name) {
      return NextResponse.json(
        { 
          success: false, 
          error: '手机号和姓名为必填项' 
        },
        { status: 400 }
      )
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请输入正确的手机号' 
        },
        { status: 400 }
      )
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      // 创建新用户
      user = await prisma.user.create({
        data: {
          phone,
          name,
          email: email || null
        }
      })
    } else {
      // 更新用户信息
      user = await prisma.user.update({
        where: { phone },
        data: {
          name,
          email: email || user.email
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email
        }
      }
    })

  } catch (error) {
    console.error('用户登录失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '登录失败，请重试' 
      },
      { status: 500 }
    )
  }
}