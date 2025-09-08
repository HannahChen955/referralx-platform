/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // 完全禁用优化，确保兼容性
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 强制使用 Node.js 运行时
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // 输出配置
  output: 'standalone',
}

module.exports = nextConfig