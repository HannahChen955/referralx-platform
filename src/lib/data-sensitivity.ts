// 敏感信息检测和脱敏工具

// 敏感信息检测规则
export const sensitivePatterns = {
  // 手机号：1开头，11位数字
  phone: /1[3-9]\d{9}/g,
  
  // 邮箱：基本邮箱格式
  email: /[\w.-]+@[\w.-]+\.\w+/g,
  
  // 身份证：15或18位数字
  idCard: /\d{15}|\d{17}[\dXx]/g,
  
  // 公司名相关关键词
  companyName: /(公司|集团|有限|科技|股份|企业|工作室|合作社)/g,
  
  // 常见姓名模式（2-4个中文字符，可能是姓名）
  chineseName: /[\u4e00-\u9fa5]{2,4}(?=\s|$|，|。|：|；)/g,
  
  // QQ号：5-12位数字
  qq: /[1-9]\d{4,11}/g,
  
  // 微信号：6-20位字母数字下划线
  wechat: /[a-zA-Z][a-zA-Z0-9_-]{5,19}/g
}

// 检测文本中的敏感信息
export interface SensitivityCheckResult {
  hasSensitiveInfo: boolean
  detectedTypes: string[]
  matches: { [key: string]: string[] }
  suggestions: string[]
}

export function checkSensitiveInfo(text: string): SensitivityCheckResult {
  const result: SensitivityCheckResult = {
    hasSensitiveInfo: false,
    detectedTypes: [],
    matches: {},
    suggestions: []
  }

  // 检查各种敏感信息模式
  Object.entries(sensitivePatterns).forEach(([type, pattern]) => {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      result.hasSensitiveInfo = true
      result.detectedTypes.push(type)
      result.matches[type] = matches
    }
  })

  // 生成建议
  if (result.detectedTypes.includes('phone')) {
    result.suggestions.push('检测到手机号，请移除或使用"联系方式已确认"等描述')
  }
  if (result.detectedTypes.includes('email')) {
    result.suggestions.push('检测到邮箱地址，请移除或使用"邮箱已确认"等描述')
  }
  if (result.detectedTypes.includes('chineseName')) {
    result.suggestions.push('检测到可能的姓名，请使用"候选人"、"该同学"等称谓')
  }
  if (result.detectedTypes.includes('companyName')) {
    result.suggestions.push('检测到公司名，请使用"某互联网公司"、"知名外企"等模糊描述')
  }
  if (result.detectedTypes.includes('idCard')) {
    result.suggestions.push('检测到身份证号，请立即移除')
  }

  return result
}

// 自动脱敏处理
export interface DesensitizationOptions {
  maskPhone?: boolean
  maskEmail?: boolean
  maskName?: boolean
  maskCompany?: boolean
  removeIdCard?: boolean
}

export function desensitizeText(
  text: string, 
  options: DesensitizationOptions = {}
): string {
  let result = text

  // 默认开启所有脱敏选项
  const opts = {
    maskPhone: true,
    maskEmail: true,
    maskName: true,
    maskCompany: true,
    removeIdCard: true,
    ...options
  }

  // 移除身份证号
  if (opts.removeIdCard) {
    result = result.replace(sensitivePatterns.idCard, '[身份证号已移除]')
  }

  // 脱敏手机号
  if (opts.maskPhone) {
    result = result.replace(sensitivePatterns.phone, (match) => {
      return match.substring(0, 3) + '****' + match.substring(7)
    })
  }

  // 脱敏邮箱
  if (opts.maskEmail) {
    result = result.replace(sensitivePatterns.email, (match) => {
      const [username, domain] = match.split('@')
      const maskedUsername = username.length > 2 
        ? username.substring(0, 2) + '*'.repeat(username.length - 2)
        : username
      return `${maskedUsername}@${domain}`
    })
  }

  // 脱敏姓名
  if (opts.maskName) {
    result = result.replace(sensitivePatterns.chineseName, (match) => {
      if (match.length === 2) {
        return match.charAt(0) + '*'
      } else if (match.length >= 3) {
        return match.charAt(0) + '*'.repeat(match.length - 2) + match.charAt(match.length - 1)
      }
      return match
    })
  }

  // 脱敏公司名
  if (opts.maskCompany) {
    result = result.replace(/([^\s]{2,10})(公司|集团|有限|科技|股份)/g, '某知名企业')
    result = result.replace(/([\u4e00-\u9fa5]{2,8})(公司|集团)/g, '某大型企业')
  }

  return result
}

// 为快速初筛优化的脱敏
export function desensitizeForQuickScreening(text: string): string {
  return desensitizeText(text, {
    maskPhone: false,      // 完全移除而不是脱敏
    maskEmail: false,      // 完全移除而不是脱敏
    maskName: true,        // 脱敏姓名
    maskCompany: true,     // 脱敏公司
    removeIdCard: true     // 移除身份证
  })
    .replace(sensitivePatterns.phone, '[联系方式已确认]')
    .replace(sensitivePatterns.email, '[邮箱已确认]')
    .replace(sensitivePatterns.qq, '[QQ已确认]')
    .replace(sensitivePatterns.wechat, '[微信已确认]')
}

// 生成脱敏提示
export function generateDesensitizationHint(text: string): string | null {
  const check = checkSensitiveInfo(text)
  
  if (!check.hasSensitiveInfo) {
    return null
  }

  const hints = []
  
  if (check.detectedTypes.includes('phone')) {
    hints.push('• 请移除手机号或使用"联系方式已确认"')
  }
  if (check.detectedTypes.includes('email')) {
    hints.push('• 请移除邮箱或使用"邮箱已确认"')
  }
  if (check.detectedTypes.includes('chineseName')) {
    hints.push('• 请使用"候选人"而非真实姓名')
  }
  if (check.detectedTypes.includes('companyName')) {
    hints.push('• 请使用"某互联网公司"等模糊描述')
  }

  return hints.length > 0 
    ? `检测到敏感信息，建议调整：\n${hints.join('\n')}`
    : null
}