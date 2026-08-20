'use client'

import { useEffect, useRef, useState } from 'react'
import type { DialogueTurn, VocabEntry } from '@/lib/englishpod'
import { episodeSlug } from '@/lib/englishpod-utils'

type Tab = 'lesson' | 'transcript'

type Props = {
  no: number
  dialogue: DialogueTurn[]
  keyVocab: VocabEntry[]
  suppVocab: VocabEntry[]
}

/** 期次内容区：固定视窗布局——tab 行固定，内容在高度恒定的视窗内滚动 */
export function EpisodeView({ no, dialogue, keyVocab, suppVocab }: Props) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'lesson', label: dialogue.length > 0 ? '对话' : '词汇' },
    { id: 'transcript', label: '全文' },
  ]

  const [tab, setTab] = useState<Tab>(tabs[0].id)
  const [transcript, setTranscript] = useState<string[] | null>(null)
  const [transcriptError, setTranscriptError] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  // 前后翻期时视窗滚动位置复位
  useEffect(() => {
    viewportRef.current?.scrollTo(0, 0)
  }, [no])

  useEffect(() => {
    if (tab !== 'transcript' || transcript !== null || transcriptError) return
    const controller = new AbortController()
    fetch(`/englishpod/txt/englishpod_${episodeSlug(no)}.txt`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then((t) =>
        setTranscript(
          t
            .split('\n')
            .map((s) => s.trim().replace(/([a-z])- ([a-z])/g, '$1$2'))
            .filter(Boolean),
        ),
      )
      .catch((err) => {
        if (err.name !== 'AbortError') setTranscriptError(true)
      })
    return () => controller.abort()
  }, [tab, transcript, transcriptError, no])

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 gap-x-6 border-b border-line/70">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'true' : undefined}
            className={`-mb-px cursor-pointer border-b-2 pb-2.5 font-mono text-xs transition-colors ${
              tab === t.id
                ? 'border-accent text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={viewportRef} className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
        {tab === 'lesson' && (
          <div>
            <div className="flex flex-col gap-2">
              {dialogue.map((turn, i) => (
                <div key={i} className="flex gap-4">
                  <span
                    className={`w-4 shrink-0 pt-[3px] font-mono text-xs font-bold ${
                      turn.speaker === 'A' ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    {turn.speaker}
                  </span>
                  <p className="min-w-0 flex-1 text-[15px] leading-[1.7]">{turn.text}</p>
                </div>
              ))}
            </div>

            {keyVocab.length + suppVocab.length > 0 && (
              <div className="mt-10 flex flex-col gap-8 border-t border-line/70 pt-8">
                {keyVocab.length > 0 && (
                  <VocabSection title="核心词汇" entries={keyVocab} />
                )}
                {suppVocab.length > 0 && (
                  <VocabSection title="拓展词汇" entries={suppVocab} />
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'transcript' &&
          (transcriptError ? (
            <div className="py-6 text-sm text-muted">
              全文加载失败。{' '}
              <button
                type="button"
                onClick={() => setTranscriptError(false)}
                className="text-accent underline underline-offset-4"
              >
                重试
              </button>
            </div>
          ) : transcript === null ? (
            <p className="animate-pulse py-6 font-mono text-xs text-muted">
              正在加载全文…
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="mb-4 font-mono text-[11px] text-muted">
                播客全文 · {transcript.length} 行
              </p>
              {transcript.map((line, i) => (
                <p key={i} className="text-sm leading-6 text-ink/80">
                  {line}
                </p>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

function VocabSection({ title, entries }: { title: string; entries: VocabEntry[] }) {
  return (
    <section>
      <h3 className="font-mono text-[11px] tracking-[0.2em] text-muted">{title}</h3>
      <div className="mt-2 flex flex-col divide-y divide-line/60">
        {entries.map((v) => (
          <div key={v.term} className="py-2.5">
            <p className="leading-snug">
              <span className="font-serif text-[16px] font-semibold">{v.term}</span>
              {v.pos && (
                <span className="ml-2.5 text-xs italic text-muted">{v.pos}</span>
              )}
            </p>
            {v.def && (
              <p className="mt-1 text-sm leading-relaxed text-muted">{v.def}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
