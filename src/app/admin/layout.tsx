import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReferralX 管理后台',
  description: 'ReferralX 管理员控制台',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}