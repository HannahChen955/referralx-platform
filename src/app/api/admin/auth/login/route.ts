import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请输入邮箱和密码' 
        },
        { status: 400 }
      )
    }

    // 查找管理员用户
    const adminUser = await prisma.adminUser.findUnique({
      where: { 
        email: email.toLowerCase(),
        isActive: true 
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱或密码错误' 
        },
        { status: 401 }
      )
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, adminUser.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: '邮箱或密码错误' 
        },
        { status: 401 }
      )
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        adminId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    })

  } catch (error) {
    console.error('管理员登录失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '登录失败，请重试' 
      },
      { status: 500 }
    )
  }
}