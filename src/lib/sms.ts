// 短信服务接口
interface SMSProvider {
  sendVerificationCode(phone: string, code: string): Promise<boolean>
}

// 阿里云短信服务实现
class AliyunSMS implements SMSProvider {
  private accessKeyId: string
  private accessKeySecret: string
  
  constructor() {
    this.accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID || ''
    this.accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET || ''
  }
  
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    // TODO: 实现阿里云短信发送
    // 开发环境下，直接将验证码打印到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 验证码已发送到 ${phone}: ${code}`)
      return true
    }
    
    // 生产环境下，调用阿里云API
    // 这里需要您提供阿里云短信服务的配置
    return true
  }
}

// 验证码管理
class VerificationCodeManager {
  private static codes = new Map<string, { code: string; expiry: number }>()
  
  // 生成6位数验证码
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
  
  // 存储验证码（5分钟有效期）
  static storeCode(phone: string, code: string): void {
    const expiry = Date.now() + 5 * 60 * 1000 // 5分钟
    this.codes.set(phone, { code, expiry })
  }
  
  // 验证码校验
  static verifyCode(phone: string, inputCode: string): boolean {
    const stored = this.codes.get(phone)
    
    if (!stored) {
      return false
    }
    
    if (Date.now() > stored.expiry) {
      this.codes.delete(phone)
      return false
    }
    
    if (stored.code !== inputCode) {
      return false
    }
    
    this.codes.delete(phone)
    return true
  }
  
  // 清理过期验证码
  static cleanupExpired(): void {
    const now = Date.now()
    for (const [phone, data] of this.codes.entries()) {
      if (now > data.expiry) {
        this.codes.delete(phone)
      }
    }
  }
}

// 导出短信服务实例
export const smsProvider = new AliyunSMS()
export { VerificationCodeManager }