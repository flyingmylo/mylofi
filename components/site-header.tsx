import Link from 'next/link'
import { Rss } from 'lucide-react'
import { site } from '@/lib/site'
import { ThemeToggle } from '@/components/theme-toggle'

const nav = [
  { href: '/', label: '文章' },
  { href: '/tags/', label: '标签' },
  { href: '/search/', label: '搜索' },
  { href: '/about/', label: '关于' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        {/* 终端风 wordmark：mylofi + 闪烁方块光标 */}
        <Link
          href="/"
          className="font-mono text-base font-bold tracking-tight transition-colors hover:text-accent"
        >
          {site.name}
          <span className="cursor-blink ml-1 text-accent">█</span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2.5 py-1.5 font-mono text-sm text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/feed.xml"
            aria-label="RSS 订阅"
            className="rounded p-2 text-muted transition-colors hover:text-accent"
          >
            <Rss size={16} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
