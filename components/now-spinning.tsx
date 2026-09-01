'use client'

import { useMemo } from 'react'
import { lofiRadio } from '@/lib/lofi'
import { useLofiPlaying } from '@/components/lofi-state'

/** 侧栏「正在转」：当前电台曲目 + VU 表，播放时律动 */
export function NowSpinning() {
  const playing = useLofiPlaying()
  const bars = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ delay: i * 0.09, dur: 0.9 + (i % 5) * 0.13 })),
    [],
  )
  return (
    <div className="card-shadow rounded-xl border border-line bg-paper p-5">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        Now Spinning · 正在转
      </h4>
      <div className="mt-4 flex items-center gap-3.5">
        <div
          className={`vinyl size-14 shrink-0 ${playing ? 'animate-[spin_6s_linear_infinite]' : ''}`}
        />
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-semibold">{lofiRadio.title}</p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
            {lofiRadio.artist}
          </p>
          <p className="mt-1 text-[11px] text-muted">来自右下角的电台 · 单曲循环</p>
        </div>
      </div>
      <div aria-hidden className={`mt-3 flex h-[18px] items-end gap-[2px] ${playing ? 'vu-on' : ''}`}>
        {bars.map((b, i) => (
          <i
            key={i}
            className="vu-bar"
            style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
          />
        ))}
      </div>
    </div>
  )
}
