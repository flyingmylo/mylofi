'use client'

import { useEffect, useRef, useState } from 'react'
import { Disc3 } from 'lucide-react'
import { lofiRadio } from '@/lib/lofi'

/**
 * 右下角 lofi 迷你电台：唱片圆钮，点击播放/暂停，单曲循环。
 * 挂在根布局上，客户端路由跳转不卸载，跨页面音乐不中断。
 */
export function LofiRadio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  // 深夜彩蛋：22 点后悬停提示换成 late night；用 effect 计算，避免 SSR 水合不一致
  const [late, setLate] = useState(false)

  useEffect(() => {
    setLate(new Date().getHours() >= 22)
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) void a.play().catch(() => {}) // Edge:自动播放策略拦截时静默失败，再点一次即可
    else a.pause()
  }

  return (
    <div className="fixed right-5 bottom-5 z-50 pb-[env(safe-area-inset-bottom)]">
      <audio
        ref={audioRef}
        src={lofiRadio.src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `暂停 ${lofiRadio.title}` : `播放 ${lofiRadio.title}`}
        title={`${lofiRadio.title} — ${lofiRadio.artist} · ${late ? '🌙 late night lofi' : 'lofi radio'}`}
        className="flex size-12 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:border-accent/70"
      >
        <Disc3
          className={`size-6 ${
            playing
              ? 'animate-spin text-accent [animation-duration:4s] motion-reduce:animate-none'
              : 'text-muted'
          }`}
        />
      </button>
    </div>
  )
}
