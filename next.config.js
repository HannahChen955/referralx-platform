/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // 完全禁用 SWC，使用 Babel
  swcMinify: false,
  compiler: {
    // 禁用 SWC 编译器
    swc: false,
  },
  experimental: {
    esmExternals: false,
    // 强制使用传统构建方式
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig