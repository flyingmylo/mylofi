import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: '关于' }

export default function AboutPage() {
  return (
    <div className="prose mx-auto max-w-2xl prose-headings:tracking-tight prose-a:underline-offset-4 prose-blockquote:font-serif prose-blockquote:not-italic">
      <h1>关于</h1>
      <blockquote>
        <p>A CHAMPAGNE SUPERNOVA IN THE SKY :D</p>
      </blockquote>
      <p>
        我是 {site.author}。{site.description}
      </p>
      <p>在这里写技术，也写生活。</p>
      <h2>本站</h2>
      <ul>
        <li>Next.js（静态导出）+ React + TypeScript</li>
        <li>Tailwind CSS，手工打磨的主题</li>
        <li>Pagefind 全文搜索 · Giscus 评论</li>
        <li>托管于 Cloudflare Pages</li>
      </ul>
    </div>
  )
}
