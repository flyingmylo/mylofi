'use client'

import { useEffect, useState } from 'react'

/**
 * 电台播放态的极简事件桥：LofiRadio 播放/暂停时广播 `lofi:change`，
 * 页脚波形、首页唱片等订阅它点亮。用 window 事件而非全局 Context，
 * 避免为一个小挂件重构组件树。
 */
export function useLofiPlaying(): boolean {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const handler = (e: Event) =>
      setPlaying(Boolean((e as CustomEvent<{ playing: boolean }>).detail?.playing))
    window.addEventListener('lofi:change', handler)
    return () => window.removeEventListener('lofi:change', handler)
  }, [])
  return playing
}

/** 外部播放/暂停入口（页脚按钮）：LofiRadio 监听并执行 */
export function toggleLofi(): void {
  window.dispatchEvent(new CustomEvent('lofi:toggle'))
}
