import Dysmsapi, { SendSmsRequest } from '@alicloud/dysmsapi20170525'
import { Config } from '@alicloud/openapi-client'

// 短信服务接口
interface SMSProvider {
  sendVerificationCode(phone: string, code: string): Promise<boolean>
}

// 阿里云短信服务实现
class AliyunSMS implements SMSProvider {
  private client: Dysmsapi | null = null
  private readonly signName: string
  private readonly templateCode: string
  
  constructor() {
    this.signName = process.env.ALIYUN_SMS_SIGN_NAME || 'ReferralX'
    this.templateCode = process.env.ALIYUN_SMS_TEMPLATE_CODE || 'SMS_123456789'
    
    // 只在生产环境或配置了密钥时初始化客户端
    if (this.shouldInitializeClient()) {
      this.initializeClient()
    }
  }
  
  private shouldInitializeClient(): boolean {
    const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID
    const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET
    return Boolean((process.env.NODE_ENV === 'production' && accessKeyId && accessKeySecret) ||
                  (process.env.NODE_ENV === 'development' && accessKeyId && accessKeySecret))
  }
  
  private initializeClient(): void {
    try {
      const config = new Config({
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
        endpoint: 'dysmsapi.aliyuncs.com'
      })
      this.client = new Dysmsapi(config)
      console.log('✅ 阿里云短信服务已初始化')
    } catch (error) {
      console.error('❌ 阿里云短信服务初始化失败:', error)
    }
  }
  
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    // 开发环境下默认使用控制台输出
    if (process.env.NODE_ENV === 'development' && !this.client) {
      console.log(`📱 [开发模式] 验证码已发送到 ${phone}: ${code}`)
      console.log(`📝 提示：如需测试真实短信，请在 .env.local 中配置阿里云密钥`)
      return true
    }
    
    // 生产环境或配置了真实密钥时发送真实短信
    if (this.client) {
      return this.sendRealSMS(phone, code)
    }
    
    // 兜底：控制台输出
    console.log(`📱 [模拟模式] 验证码已发送到 ${phone}: ${code}`)
    return true
  }
  
  private async sendRealSMS(phone: string, code: string): Promise<boolean> {
    try {
      const request = new SendSmsRequest({
        phoneNumbers: phone,
        signName: this.signName,
        templateCode: this.templateCode,
        templateParam: JSON.stringify({ code })
      })
      
      const response = await this.client!.sendSms(request)
      
      if (response.body?.code === 'OK') {
        console.log(`✅ 短信发送成功: ${phone}`)
        return true
      } else {
        console.error(`❌ 短信发送失败: ${response.body?.code} - ${response.body?.message}`)
        return false
      }
    } catch (error) {
      console.error('❌ 阿里云短信发送异常:', error)
      return false
    }
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
export const smsProvider = new AliyunSMS()
export { VerificationCodeManager }