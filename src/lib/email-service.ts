// 邮件发送服务
import nodemailer from 'nodemailer'

// 邮件配置
const createTransporter = () => {
  // 在实际环境中，这里会使用真实的SMTP配置
  // MVP阶段使用console输出模拟邮件发送
  return {
    sendMail: async (options: any) => {
      console.log('📧 模拟邮件发送:')
      console.log('收件人:', options.to)
      console.log('主题:', options.subject)
      console.log('内容:', options.html || options.text)
      console.log('---邮件结束---')
      
      return { 
        messageId: 'mock-message-id-' + Date.now(),
        response: 'Mock email sent successfully'
      }
    }
  }
}

// 快速初筛邮件模板
export function generateQuickScreeningEmail(data: {
  referralId: string
  userName: string
  jobTitle: string
  company: string
  candidateInfo: {
    industry?: string
    experience?: string
    skills?: string
    education?: string
    location?: string
    matchReason?: string
  }
}) {
  const timestamp = new Date().toLocaleString('zh-CN')
  
  return {
    subject: `[快速初筛] 职位：${data.jobTitle} - ${timestamp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">ReferralX - 快速初筛请求</h2>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #374151; margin-top: 0;">推荐信息</h3>
          <p><strong>推荐ID：</strong>${data.referralId}</p>
          <p><strong>推荐人：</strong>${data.userName}</p>
          <p><strong>目标职位：</strong>${data.jobTitle}</p>
          <p><strong>招聘公司：</strong>${data.company}</p>
          <p><strong>提交时间：</strong>${timestamp}</p>
        </div>

        <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #92400e; margin-top: 0;">候选人概况（已脱敏）</h3>
          <p><strong>行业方向：</strong>${data.candidateInfo.industry || '未提供'}</p>
          <p><strong>工作年限：</strong>${data.candidateInfo.experience || '未提供'}</p>
          <p><strong>技能亮点：</strong>${data.candidateInfo.skills || '未提供'}</p>
          <p><strong>学历层级：</strong>${data.candidateInfo.education || '未提供'}</p>
          <p><strong>所在城市：</strong>${data.candidateInfo.location || '未提供'}</p>
          <p><strong>匹配理由：</strong>${data.candidateInfo.matchReason || '未提供'}</p>
        </div>

        <div style="background: #dbeafe; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">处理说明</h3>
          <p>• 此信息已经过脱敏处理，不包含候选人姓名、联系方式等敏感信息</p>
          <p>• 请评估候选人背景与职位的匹配度</p>
          <p>• 评估完成后，请通过平台留言系统反馈结果给推荐人</p>
          <p>• 如匹配度高，建议推荐人联系候选人征得同意后提交正式推荐</p>
        </div>

        <hr style="margin: 24px 0;" />
        <p style="color: #6b7280; font-size: 14px;">
          这是一封自动生成的邮件，请勿直接回复。<br/>
          如有疑问，请联系平台管理员。
        </p>
      </div>
    `
  }
}

// 正式推荐邮件模板
export function generateFormalReferralEmail(data: {
  referralId: string
  userName: string
  jobTitle: string
  company: string
  candidateInfo: {
    name: string
    phone: string
    email?: string
    experience?: string
    skills?: string
    education?: string
    currentCompany?: string
    matchReason?: string
  }
}) {
  const timestamp = new Date().toLocaleString('zh-CN')
  
  return {
    subject: `[正式推荐] 职位：${data.jobTitle} - ${data.candidateInfo.name} - ${timestamp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">ReferralX - 正式推荐</h2>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #374151; margin-top: 0;">推荐信息</h3>
          <p><strong>推荐ID：</strong>${data.referralId}</p>
          <p><strong>推荐人：</strong>${data.userName}</p>
          <p><strong>目标职位：</strong>${data.jobTitle}</p>
          <p><strong>招聘公司：</strong>${data.company}</p>
          <p><strong>提交时间：</strong>${timestamp}</p>
        </div>

        <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #065f46; margin-top: 0;">候选人完整信息</h3>
          <p><strong>姓名：</strong>${data.candidateInfo.name}</p>
          <p><strong>联系电话：</strong>${data.candidateInfo.phone}</p>
          ${data.candidateInfo.email ? `<p><strong>邮箱：</strong>${data.candidateInfo.email}</p>` : ''}
          <p><strong>工作经验：</strong>${data.candidateInfo.experience || '未提供'}</p>
          <p><strong>核心技能：</strong>${data.candidateInfo.skills || '未提供'}</p>
          <p><strong>学历背景：</strong>${data.candidateInfo.education || '未提供'}</p>
          ${data.candidateInfo.currentCompany ? `<p><strong>当前公司：</strong>${data.candidateInfo.currentCompany}</p>` : ''}
          <p><strong>推荐理由：</strong>${data.candidateInfo.matchReason || '未提供'}</p>
        </div>

        <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #991b1b; margin-top: 0;">重要提醒</h3>
          <p>• 推荐人已确认获得候选人同意进行此次推荐</p>
          <p>• 请及时联系候选人安排后续面试流程</p>
          <p>• 候选人信息请严格保密，仅用于招聘目的</p>
          <p>• 处理完成后请及时通过平台反馈进展状态</p>
        </div>

        <hr style="margin: 24px 0;" />
        <p style="color: #6b7280; font-size: 14px;">
          这是一封自动生成的邮件，请勿直接回复。<br/>
          如有疑问，请联系平台管理员。
        </p>
      </div>
    `
  }
}

// 发送快速初筛邮件
export async function sendQuickScreeningEmail(data: Parameters<typeof generateQuickScreeningEmail>[0]) {
  try {
    const transporter = createTransporter()
    const emailContent = generateQuickScreeningEmail(data)
    
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@referralx.com',
      to: process.env.QUICK_SCREENING_EMAIL || 'quickscreen@referralx.com',
      subject: emailContent.subject,
      html: emailContent.html
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('快速初筛邮件发送失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}

// 发送正式推荐邮件
export async function sendFormalReferralEmail(data: Parameters<typeof generateFormalReferralEmail>[0]) {
  try {
    const transporter = createTransporter()
    const emailContent = generateFormalReferralEmail(data)
    
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@referralx.com',
      to: process.env.FORMAL_REFERRAL_EMAIL || 'referral@referralx.com',
      subject: emailContent.subject,
      html: emailContent.html
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('正式推荐邮件发送失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知错误' }
  }
}