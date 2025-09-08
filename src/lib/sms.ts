// 短信服务接口
interface SMSProvider {
  sendVerificationCode(phone: string, code: string): Promise<boolean>
}

// 简化的短信服务实现（开发模式）
class MockSMSService implements SMSProvider {
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    // 开发模式：控制台输出验证码
    console.log(`📱 [开发模式] 验证码已发送到 ${phone}: ${code}`)
    console.log(`📝 提示：这是开发模式，实际未发送短信。生产环境需配置短信服务商。`)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
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
    const phonesToDelete: string[] = []
    
    this.codes.forEach((data, phone) => {
      if (now > data.expiry) {
        phonesToDelete.push(phone)
      }
    })
    
    phonesToDelete.forEach(phone => {
      this.codes.delete(phone)
    })
  }
}

// 导出短信服务实例
export const smsProvider = new MockSMSService()
export { VerificationCodeManager }