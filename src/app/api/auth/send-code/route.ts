import { NextRequest, NextResponse } from 'next/server'
import { smsProvider, VerificationCodeManager } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: '请输入有效的手机号' },
        { status: 400 }
      )
    }
    
    // 生成验证码
    const code = VerificationCodeManager.generateCode()
    
    // 存储验证码
    VerificationCodeManager.storeCode(phone, code)
    
    // 发送验证码
    const sent = await smsProvider.sendVerificationCode(phone, code)
    
    if (!sent) {
      return NextResponse.json(
        { success: false, error: '验证码发送失败，请稍后重试' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '验证码已发送',
      // 开发环境或演示模式下返回验证码，方便测试
      ...(process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true' ? { code } : {})
    })
    
  } catch (error) {
    console.error('发送验证码失败:', error)
    return NextResponse.json(
      { success: false, error: '发送验证码失败' },
      { status: 500 }
    )
  }
}