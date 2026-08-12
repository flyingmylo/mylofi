import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-1 px-6 py-8 font-mono text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-500">
        <span>
          © {new Date().getFullYear()} {site.author} · {site.name}
        </span>
        <span>next.js × cloudflare pages</span>
      </div>
    </footer>
  )
}
