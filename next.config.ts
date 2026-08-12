import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 纯静态导出，产物在 out/，直接托管到 Cloudflare Pages
  output: 'export',
  // 静态导出不支持 next/image 服务端优化
  images: { unoptimized: true },
  // 生成 /posts/slug/index.html 形式的 URL，与 Hugo 风格一致
  trailingSlash: true,
}

export default nextConfig
