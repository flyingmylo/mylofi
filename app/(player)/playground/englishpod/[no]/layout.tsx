import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

/** Englishpod 期次页专用布局：固定高度框架（h-dvh），只有内容视窗滚动 */
export default function PlayerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader compact />
      <main className="mx-auto flex w-full min-h-0 max-w-2xl flex-1 flex-col px-6 pt-8 pb-5">
        {children}
      </main>
      <SiteFooter compact />
    </div>
  )
}
