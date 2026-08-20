import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  getAllEpisodes,
  getCategories,
  getEpisodesInGroup,
  getGroupCount,
  getGroupRange,
} from '@/lib/englishpod'
import { EpisodeBrowser } from './episode-browser'

/** Englishpod 分组浏览页主体：分组 tabs + 当前组列表 + 翻组导航 */
export function EnglishpodBrowserPage({ group }: { group: number }) {
  const episodes = getEpisodesInGroup(group)
  const groupCount = getGroupCount()
  const total = getAllEpisodes().length
  const categoryCount = getCategories().length
  const range = getGroupRange(group)

  const groupHref = (g: number) =>
    g === 1 ? '/playground/englishpod/' : `/playground/englishpod/g/${g}/`

  const groups = Array.from({ length: groupCount }, (_, i) => i + 1).map((g) => {
    const r = getGroupRange(g)
    return { label: `${r.start}–${r.end}`, href: groupHref(g), active: g === group }
  })

  return (
    <div>
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Englishpod</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          EnglishPod 播客 365 期档案：对话、词汇要点与播客全文。
        </p>
        <p className="mt-3 font-mono text-[11px] tracking-wide text-muted">
          {total} EPISODES · {categoryCount} CATEGORIES
        </p>
      </header>

      <EpisodeBrowser episodes={episodes} groups={groups} total={total} />

      <div className="mt-10 flex items-center justify-between border-t border-line/70 pt-6 font-mono text-xs">
        {group > 1 ? (
          <Link
            href={groupHref(group - 1)}
            className="flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={13} />
            {getGroupRange(group - 1).start}–{getGroupRange(group - 1).end}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/playground/"
          className="text-muted transition-colors hover:text-accent"
        >
          游乐场
        </Link>
        {group < groupCount ? (
          <Link
            href={groupHref(group + 1)}
            className="flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
          >
            {getGroupRange(group + 1).start}–{getGroupRange(group + 1).end}
            <ArrowRight size={13} />
          </Link>
        ) : (
          <span />
        )}
      </div>

      <p className="mt-6 font-mono text-[11px] text-muted">
        当前第 {range.start}–{range.end} 期，共 {episodes.length} 期
      </p>
    </div>
  )
}
