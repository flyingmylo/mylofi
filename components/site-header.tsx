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
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-neutral-50/80 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-base font-bold tracking-tight transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {site.name}
          <span className="cursor-blink ml-0.5 text-indigo-600 dark:text-indigo-400">_</span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/feed.xml"
            aria-label="RSS 订阅"
            className="rounded-md p-2 text-neutral-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Rss size={16} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
