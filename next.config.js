/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  swcMinify: false,
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig