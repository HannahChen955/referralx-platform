'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [demoCode, setDemoCode] = useState('')

  // 发送验证码
  const sendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入有效的手机号')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await res.json()

      if (data.success) {
        setCodeSent(true)
        setCountdown(60)
        
        // 开发环境或演示模式下显示验证码
        if (data.code) {
          setDemoCode(data.code)
          // 也可以用alert作为备用
          // alert(`验证码：${data.code}`)
        }

        // 倒计时
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(data.error || '发送失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 登录
  const handleLogin = async () => {
    if (!phone || !code) {
      setError('请输入手机号和验证码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login-with-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      })

      const data = await res.json()

      if (data.success) {
        // 保存token
        localStorage.setItem('user_token', data.data.token)
        localStorage.setItem('user_info', JSON.stringify(data.data.user))
        
        // 跳转到首页或之前的页面
        router.push('/')
      } else {
        setError(data.error || '登录失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
            <p className="text-gray-600">使用手机号快速登录</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                手机号
              </label>
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
              />
            </div>

            {codeSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  验证码
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendCode}
                    disabled={countdown > 0 || loading}
                    className="min-w-[100px]"
                  >
                    {countdown > 0 ? `${countdown}秒` : '重新发送'}
                  </Button>
                </div>
                {/* 演示模式下显示验证码 */}
                {demoCode && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>演示验证码：{demoCode}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      （仅在演示环境中显示，生产环境将通过短信发送）
                    </p>
                  </div>
                )}
              </div>
            )}

            {!codeSent ? (
              <Button
                onClick={sendCode}
                disabled={loading}
                className="w-full"
              >
                {loading ? '发送中...' : '获取验证码'}
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            )}

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                还没有账号？验证后将自动注册
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}