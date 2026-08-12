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
    <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-tight transition-colors hover:text-accent"
        >
          {site.name}
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
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
