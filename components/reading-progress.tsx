'use client'

import { useEffect, useState } from 'react'

/**
 * 磁带走带式阅读进度：吸顶在文章列顶部，细线 + accent 填充 + 一枚「磁头」圆点。
 * 仅在文章页使用，进度按整页滚动计算。
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      // Edge:页面不足一屏时 max 为 0，直接满格
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden
      className="sticky top-16 z-30 -mx-2 mb-10 mt-2 h-[3px] sm:top-16"
    >
      <div className="relative h-full w-full bg-line/60">
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
        {/* 磁头 */}
        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-[left] duration-150 ease-out"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
