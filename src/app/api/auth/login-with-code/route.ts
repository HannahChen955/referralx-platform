import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { VerificationCodeManager } from '@/lib/sms'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()
    
    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: '请输入有效的手机号' },
        { status: 400 }
      )
    }
    
    // 验证验证码
    const isValid = VerificationCodeManager.verifyCode(phone, code)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '验证码错误或已过期' },
        { status: 400 }
      )
    }
    
    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { phone }
    })
    
    if (!user) {
      // 新用户自动注册
      user = await prisma.user.create({
        data: {
          phone,
          name: `用户${phone.slice(-4)}`, // 默认昵称
          isActive: true
        }
      })
    }
    
    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        phone: user.phone,
        name: user.name
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )
    
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone
        }
      }
    })
    
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}