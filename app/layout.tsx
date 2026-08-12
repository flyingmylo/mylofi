import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { site } from '@/lib/site'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { siteName: site.name, locale: site.locale, type: 'website' },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider>
          <SiteHeader />
          {/* 非对称布局：内容栏偏左，右侧留白 + 竖排装饰文字 */}
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-14 pb-24 sm:pt-20">
            <div className="flex gap-12">
              <div className="w-full max-w-xl min-w-0">{children}</div>
              <aside
                aria-hidden
                className="hidden flex-1 items-start justify-end pt-1 lg:flex"
              >
                <span className="font-mono text-[10px] tracking-[0.35em] text-muted uppercase [writing-mode:vertical-rl]">
                  est. 2019 · mylofi.fun · a tech &amp; life blog · still writing
                </span>
              </aside>
            </div>
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
