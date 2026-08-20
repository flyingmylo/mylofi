import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllEpisodes, getEpisode, getGroupRange, GROUP_SIZE } from '@/lib/englishpod'
import { episodeSlug } from '@/lib/englishpod-utils'
import { EpisodeView } from '@/components/englishpod/episode-view'

type Params = { params: Promise<{ no: string }> }

export function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ no: episodeSlug(e.no) }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { no } = await params
  const episode = /^\d{1,4}$/.test(no) ? getEpisode(Number(no)) : null
  if (!episode) return {}
  return {
    title: `EP ${episodeSlug(episode.no)} · ${episode.title}`,
    description: episode.category
      ? `EnglishPod ${episode.category}：${episode.title}`
      : `EnglishPod：${episode.title}`,
  }
}

export default async function EpisodePage({ params }: Params) {
  const { no } = await params
  const num = Number(no)
  const episode = /^\d{1,4}$/.test(no) ? getEpisode(num) : null
  if (!episode) notFound()

  const prev = getEpisode(num - 1)
  const next = getEpisode(num + 1)
  const group = Math.ceil(num / GROUP_SIZE)
  const range = getGroupRange(group)
  const groupHref =
    group === 1 ? '/playground/englishpod/' : `/playground/englishpod/g/${group}/`

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav
        aria-label="面包屑"
        className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted"
      >
        <Link
          href="/playground/"
          className="transition-colors hover:text-accent"
        >
          游乐场
        </Link>
        <span>/</span>
        <Link
          href="/playground/englishpod/"
          className="transition-colors hover:text-accent"
        >
          Englishpod
        </Link>
        <span>/</span>
        <Link href={groupHref} className="transition-colors hover:text-accent">
          {range.start}–{range.end}
        </Link>
        <span>/</span>
        <span>EP {episodeSlug(episode.no)}</span>
      </nav>

      <header className="mt-4 mb-1 shrink-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-muted">
          <span>EP {episodeSlug(episode.no)}</span>
          {episode.category && (
            <span className="rounded-full border border-line px-2.5 py-0.5">
              {episode.category}
            </span>
          )}
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-snug font-semibold tracking-tight">
          {episode.title}
        </h1>
      </header>

      <EpisodeView
        no={episode.no}
        dialogue={episode.dialogue}
        keyVocab={episode.keyVocab}
        suppVocab={episode.suppVocab}
      />

      <div className="mt-6 flex shrink-0 items-center justify-between border-t border-line/70 pt-4 font-mono text-xs">
        {prev ? (
          <Link
            href={`/playground/englishpod/${episodeSlug(prev.no)}/`}
            className="text-muted transition-colors hover:text-accent"
          >
            ← EP {episodeSlug(prev.no)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/playground/englishpod/${episodeSlug(next.no)}/`}
            className="text-muted transition-colors hover:text-accent"
          >
            EP {episodeSlug(next.no)} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
