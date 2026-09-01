import { site } from '@/lib/site'
import { LofiFooterButton, LofiWave } from '@/components/lofi-wave'

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    // Englishpod 阅读页的紧凑页脚：保持一行
    return (
      <footer className="shrink-0 border-t border-line/70">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-3.5 font-mono text-[11px] text-muted">
          <span>
            © 2019–{new Date().getFullYear()} {site.name}.fun
          </span>
          <span>next.js × cloudflare pages</span>
        </div>
      </footer>
    )
  }
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10">
      <LofiWave />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 font-mono text-[10.5px] tracking-[0.14em] text-muted">
        <span>
          © 2019–{new Date().getFullYear()} {site.name}.fun
        </span>
        <LofiFooterButton />
        <span>next.js × cloudflare pages · 33⅓ rpm</span>
      </div>
    </footer>
  )
}
