'use client'

import { useEffect, useRef, useState } from 'react'
import { Disc3 } from 'lucide-react'
import { lofiRadio } from '@/lib/lofi'

/**
 * 右下角 lofi 迷你电台：唱片圆钮，点击播放/暂停，单曲循环。
 * 挂在根布局上，客户端路由跳转不卸载，跨页面音乐不中断。
 * 播放态经 window 事件广播（lofi:change），页脚按钮等外部入口经 lofi:toggle 遥控。
 */
export function LofiRadio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  // 深夜彩蛋：22 点后悬停提示换成 late night；用 effect 计算，避免 SSR 水合不一致
  const [late, setLate] = useState(false)

  useEffect(() => {
    setLate(new Date().getHours() >= 22)
  }, [])

  const play = () => void audioRef.current?.play().catch(() => {}) // Edge:自动播放策略拦截时静默失败，再点一次即可
  const pause = () => audioRef.current?.pause()

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play()
    else pause()
  }

  // 外部遥控（页脚播放按钮）
  useEffect(() => {
    const onToggle = () => {
      const a = audioRef.current
      if (!a) return
      if (a.paused) play()
      else pause()
    }
    window.addEventListener('lofi:toggle', onToggle)
    return () => window.removeEventListener('lofi:toggle', onToggle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed right-5 bottom-5 z-50 pb-[env(safe-area-inset-bottom)]">
      <audio
        ref={audioRef}
        src={lofiRadio.src}
        loop
        preload="none"
        onPlay={() => {
          setPlaying(true)
          window.dispatchEvent(new CustomEvent('lofi:change', { detail: { playing: true } }))
        }}
        onPause={() => {
          setPlaying(false)
          window.dispatchEvent(new CustomEvent('lofi:change', { detail: { playing: false } }))
        }}
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
