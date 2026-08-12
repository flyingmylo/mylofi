'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { site } from '@/lib/site'

/**
 * Giscus 评论（基于 GitHub Discussions）。
 * 在 lib/site.ts 填好 giscus 配置后自动启用。
 * 配置向导：https://giscus.app/zh-CN
 */
export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const configured = Boolean(site.giscus.repo && site.giscus.repoId && site.giscus.categoryId)

  useEffect(() => {
    if (!configured || !containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', site.giscus.repo)
    script.setAttribute('data-repo-id', site.giscus.repoId)
    script.setAttribute('data-category', site.giscus.category)
    script.setAttribute('data-category-id', site.giscus.categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light')
    script.setAttribute('data-lang', 'zh-CN')

    containerRef.current.replaceChildren(script)
  }, [configured, resolvedTheme])

  if (!configured) {
    return (
      <p className="border-t border-dashed border-line pt-6 font-mono text-[11px] text-muted">
        评论功能未启用：在 <code>lib/site.ts</code> 中填写 Giscus 配置即可
        （配置向导见 giscus.app）。
      </p>
    )
  }

  return <div ref={containerRef} />
}
