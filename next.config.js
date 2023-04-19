/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/hk/bill-generator',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig