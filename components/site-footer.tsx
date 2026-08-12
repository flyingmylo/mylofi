import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6 text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          © {new Date().getFullYear()} {site.author}
        </span>
        <span>
          Built with Next.js · Hosted on Cloudflare Pages
        </span>
      </div>
    </footer>
  )
}
