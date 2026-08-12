import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-10 font-mono text-[11px] text-muted">
        <span>
          © 2019–{new Date().getFullYear()} {site.name}.fun
        </span>
        <span>next.js × cloudflare pages</span>
      </div>
    </footer>
  )
}
