'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rss, Search } from 'lucide-react'
import { site } from '@/lib/site'
import { ThemeToggle } from '@/components/theme-toggle'

const nav = [
  { href: '/', label: '文章' },
  { href: '/playground/', label: '游乐场' },
  { href: '/about/', label: '关于' },
]

/** 站点头部：左品牌字，右导航；当前栏目以 accent 色点亮 */
export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname()
  const isActive = (href: string) => {
    const base = href.replace(/\/$/, '')
    return base === '' ? pathname === '/' : pathname.startsWith(base)
  }

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl">
      <div
        className={`mx-auto flex ${compact ? 'h-14' : 'h-16'} w-full max-w-6xl items-center justify-between px-6`}
      >
        <Link
          href="/"
          className="font-mono text-[13px] font-medium uppercase tracking-[0.26em] transition-colors hover:text-accent"
        >
          {site.name}
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-2.5 py-1.5 font-mono text-xs transition-colors hover:text-ink ${
                isActive(item.href) ? 'text-accent' : 'text-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/search/"
            aria-label="搜索"
            className="rounded p-2 text-muted transition-colors hover:text-ink"
          >
            <Search size={14} />
          </a>
          <a
            href="/feed.xml"
            aria-label="RSS 订阅"
            className="rounded p-2 text-muted transition-colors hover:text-ink"
          >
            <Rss size={14} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
