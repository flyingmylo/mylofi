import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

/** 站点常规布局：sticky 头部 + 整页滚动 + 页脚在文档底部（原始行为） */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pt-16 pb-24 sm:pt-24">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
