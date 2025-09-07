import jwt from 'jsonwebtoken'

export interface AdminUser {
  adminId: string
  email: string
  role: string
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as AdminUser
    
    return decoded
  } catch (error) {
    console.error('Token验证失败:', error)
    return null
  }
}

export function getAdminFromRequest(request: Request): AdminUser | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  return verifyAdminToken(token)
}

// 客户端使用的token管理
export const adminAuth = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token)
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token')
    }
    return null
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
  },
  
  isAuthenticated: (): boolean => {
    const token = adminAuth.getToken()
    if (!token) return false
    
    try {
      const decoded = jwt.decode(token) as any
      if (!decoded || !decoded.exp) return false
      
      // 检查是否过期
      return decoded.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }
}