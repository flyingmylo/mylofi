import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGroupCount, getGroupRange } from '@/lib/englishpod'
import { EnglishpodBrowserPage } from '@/components/englishpod/browser-page'

type Params = { params: Promise<{ g: string }> }

/** 第 2 组及以后的分组页；第 1 组固定在 /playground/englishpod/ */
export function generateStaticParams() {
  return Array.from({ length: getGroupCount() - 1 }, (_, i) => ({
    g: String(i + 2),
  }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { g } = await params
  const group = Number(g)
  if (!Number.isInteger(group) || group < 2 || group > getGroupCount()) return {}
  const r = getGroupRange(group)
  return { title: `Englishpod · ${r.start}–${r.end}` }
}

export default async function EnglishpodGroupPage({ params }: Params) {
  const { g } = await params
  const group = Number(g)
  if (!Number.isInteger(group) || group < 2 || group > getGroupCount()) notFound()
  return (
    <div className="mx-auto max-w-3xl">
      <EnglishpodBrowserPage group={group} />
    </div>
  )
}
