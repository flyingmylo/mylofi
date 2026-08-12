import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: '关于' }

export default function AboutPage() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>关于</h1>
      <p>
        这里是 {site.name} —— 一个用 Next.js 自己搭建、部署在 Cloudflare Pages
        上的静态博客。
      </p>
      <p>在这里介绍一下你自己：你是谁、在做什么、为什么写博客。</p>
      <h2>本站技术栈</h2>
      <ul>
        <li>框架：Next.js（App Router，静态导出）+ React + TypeScript</li>
        <li>样式：Tailwind CSS v4 + Typography 插件</li>
        <li>搜索：Pagefind（构建时索引，纯静态）</li>
        <li>评论：Giscus（GitHub Discussions）</li>
        <li>托管：Cloudflare Pages（全球 CDN）</li>
      </ul>
    </div>
  )
}
