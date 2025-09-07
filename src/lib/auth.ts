export interface User {
  id: string
  phone: string
  name: string
  email?: string | null
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearUser(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('user')
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function requireAuth(): boolean {
  const user = getUser()
  if (!user) {
    // 重定向到登录页面
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
    return false
  }
  return true
}