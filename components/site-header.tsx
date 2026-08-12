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
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {site.name}
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/feed.xml"
            aria-label="RSS 订阅"
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <Rss size={18} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
