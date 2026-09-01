'use client'

import { useMemo } from 'react'
import { lofiRadio } from '@/lib/lofi'
import { toggleLofi, useLofiPlaying } from '@/components/lofi-state'

/** 页脚波形：电台播放时以淡绿缓缓起伏，静止时只是一排发丝点 */
export function LofiWave() {
  const playing = useLofiPlaying()
  const bars = useMemo(
    () => Array.from({ length: 56 }, (_, i) => ({ delay: i * 0.085, dur: 2.1 + (i % 7) * 0.17 })),
    [],
  )
  return (
    <div
      aria-hidden
      className={`flex h-[26px] items-center gap-[3px] ${playing ? 'wave-on' : ''}`}
    >
      {bars.map((b, i) => (
        <i
          key={i}
          className="wave-bar flex-1"
          style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
        />
      ))}
    </div>
  )
}

/** 页脚播放按钮：与右下角电台互为遥控 */
export function LofiFooterButton() {
  const playing = useLofiPlaying()
  return (
    <button
      type="button"
      onClick={toggleLofi}
      className="cursor-pointer rounded-full border border-line px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-ink"
    >
      {playing ? '■' : '▶'} NOW SPINNING — {lofiRadio.title} · {lofiRadio.artist}
    </button>
  )
}
