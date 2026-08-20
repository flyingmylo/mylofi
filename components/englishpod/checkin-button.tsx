'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { renderCheckinCard, type CheckinEpisode } from './checkin-card'

/** 期次索引：打开打卡时才首次拉取，模块级缓存 */
let indexCache: CheckinEpisode[] | null = null

/** 打卡：输入期号（/ 分隔，如 23/24）生成分享卡片，可复制/下载 */
export function CheckinButton({ total }: { total: number }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const blobRef = useRef<Blob | null>(null)

  const numbers = useMemo(() => {
    const nums = input
      .split('/')
      .map((s) => Number.parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n >= 1 && n <= total)
    // 打卡上限 3 期，超出只取前 3
    return [...new Set(nums)].sort((a, b) => a - b).slice(0, 3)
  }, [input, total])

  // 打开时拉取期次索引（仅一次）
  useEffect(() => {
    if (!open || indexCache || loadError) return
    fetch('/englishpod/index.json')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<CheckinEpisode[]>
      })
      .then((d) => {
        indexCache = d
      })
      .catch(() => setLoadError(true))
  }, [open, loadError])

  // 模态打开期间锁定背景滚动；Esc 关闭
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // 输入变化 → 防抖 300ms 重绘卡片
  useEffect(() => {
    if (!open || !indexCache || numbers.length === 0) {
      blobRef.current = null
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      return
    }
    const timer = setTimeout(() => {
      const eps = numbers.map((no) => {
        const hit = indexCache!.find((e) => e.no === no)
        return hit ?? { no, title: `Episode ${no}` }
      })
      renderCheckinCard(eps)
        .then((blob) => {
          blobRef.current = blob
          setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return URL.createObjectURL(blob)
          })
        })
        .catch(() => setLoadError(true))
    }, 300)
    return () => clearTimeout(timer)
  }, [open, numbers])

  async function copyImage() {
    const blob = blobRef.current
    if (!blob) return
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      download()
    }
  }

  function download() {
    const blob = blobRef.current
    if (!blob) return
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `englishpod-checkin-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.png`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
      >
        打卡
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-line bg-paper p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">打卡</h2>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded p-1 text-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              inputMode="numeric"
              placeholder={`期号，如 23/24/25（最多 3 期）`}
              autoFocus
              className="mt-5 w-full border-b border-line/70 bg-transparent py-2 pr-2 font-mono text-sm text-ink transition-colors placeholder:text-muted/70 focus:border-accent focus:outline-none"
            />

            <div className="mt-4 flex min-h-40 items-center justify-center">
              {loadError ? (
                <p className="text-sm text-muted">数据加载失败，请重试。</p>
              ) : previewUrl ? (
                // blob URL 的临时预览，next/image 无法优化，无 LCP 影响
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="打卡卡片预览"
                  className="w-full rounded-md border border-line"
                />
              ) : (
                <p className="font-mono text-xs text-muted">
                  {numbers.length > 0 ? '正在生成卡片…' : '输入期号生成打卡卡片'}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={copyImage}
                disabled={!previewUrl}
                className="cursor-pointer rounded-md bg-ink px-4 py-2 font-mono text-xs text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? '已复制 ✓' : '复制图片'}
              </button>
              <button
                type="button"
                onClick={download}
                disabled={!previewUrl}
                className="cursor-pointer rounded-md border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                下载 PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
