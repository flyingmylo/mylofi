'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import type { EpisodeMeta } from '@/lib/englishpod'
import { episodeSlug } from '@/lib/englishpod-utils'

type GroupLink = { label: string; href: string; active: boolean }

type Props = {
  episodes: EpisodeMeta[]
  /** 分组 tabs（服务端算好范围与链接） */
  groups: GroupLink[]
  /** 全部期数（用于期号跳转校验） */
  total: number
}

/** 分组浏览：tabs + 期号搜索同排，期次列表在下方 */
export function EpisodeBrowser({ episodes, groups, total }: Props) {
  const [query, setQuery] = useState('')

  const no = Number.parseInt(query.trim(), 10)
  const isEpisodeNo = !Number.isNaN(no) && no >= 1 && no <= total

  const filtered = useMemo(() => {
    return episodes.filter((e) => (isEpisodeNo ? e.no === no : true))
  }, [episodes, isEpisodeNo, no])

  return (
    <div className="mt-6">
      <div className="flex items-end justify-between gap-4 border-b border-line/70">
        <nav aria-label="期次分组" className="flex flex-wrap gap-x-4 gap-y-1">
          {groups.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              aria-current={g.active ? 'page' : undefined}
              className={`-mb-px border-b-2 pb-2.5 font-mono text-xs tabular-nums transition-colors ${
                g.active
                  ? 'border-accent text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {g.label}
            </Link>
          ))}
        </nav>

        <div className="relative shrink-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.replace(/\D/g, '').slice(0, 3))}
            inputMode="numeric"
            placeholder="期号"
            aria-label="按期号筛选"
            className="w-20 border-b border-line/70 bg-transparent pb-1.5 pr-5 text-right font-mono text-xs text-ink tabular-nums transition-colors placeholder:text-muted/70 focus:border-accent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="清空期号"
              onClick={() => setQuery('')}
              className="absolute top-0 right-0 p-1 text-muted transition-colors hover:text-ink"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-5 flex flex-col divide-y divide-line/70 border-y border-line/70">
          {filtered.map((e) => (
            <Link
              key={e.no}
              href={`/playground/englishpod/${episodeSlug(e.no)}/`}
              className="group flex items-baseline gap-4 py-3.5 sm:gap-6"
            >
              <span className="w-11 shrink-0 font-mono text-[11px] text-muted tabular-nums transition-colors group-hover:text-accent">
                {episodeSlug(e.no)}
              </span>
              <h3 className="min-w-0 flex-1 font-serif text-[17px] leading-snug transition-colors duration-200 group-hover:text-accent">
                {e.title}
              </h3>
              {e.category && (
                <span className="hidden shrink-0 font-mono text-[10px] text-muted sm:block">
                  {e.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : isEpisodeNo ? (
        <div className="mt-5 border-y border-line/70 py-10 text-center text-sm text-muted">
          EP {episodeSlug(no)} 不在本组，{' '}
          <Link
            href={`/playground/englishpod/${episodeSlug(no)}/`}
            className="text-accent underline underline-offset-4"
          >
            直接跳转 -&gt;
          </Link>
        </div>
      ) : (
        <p className="mt-5 border-y border-line/70 py-10 text-center text-sm text-muted">
          本组没有匹配的期次。
        </p>
      )}
    </div>
  )
}
