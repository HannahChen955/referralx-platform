/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 外部包配置 (更新到新的配置名称)
  serverExternalPackages: ['@prisma/client'],
  // 输出配置
  output: 'standalone',
}

module.exports = nextConfig