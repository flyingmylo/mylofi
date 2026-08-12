import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-dashed border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1.5 px-6 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          © 2019–{new Date().getFullYear()} {site.author} · {site.name}.fun
        </span>
        <span>next.js × cloudflare pages · solarized inside</span>
      </div>
    </footer>
  )
}
