'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    PagefindUI?: new (options: Record<string, unknown>) => unknown
  }
}

/**
 * Pagefind 搜索 UI。
 * 索引在 `npm run build` 时由 pagefind 对 out/ 目录生成，
 * 因此开发环境（next dev）下不可用，构建部署后生效。
 */
export function PagefindSearch() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = '/pagefind/pagefind-ui.css'
    document.head.appendChild(css)

    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = () => {
      if (window.PagefindUI) {
        new window.PagefindUI({
          element: '#pagefind-search',
          showSubResults: true,
          showImages: false,
          placeholder: '搜索文章…',
          translations: {
            placeholder: '搜索文章…',
            zero_results: '没有找到「[SEARCH_TERM]」相关的内容',
          },
        })
        setStatus('ready')
      } else {
        setStatus('unavailable')
      }
    }
    script.onerror = () => setStatus('unavailable')
    document.body.appendChild(script)

    return () => {
      script.remove()
      css.remove()
    }
  }, [])

  return (
    <div>
      <div id="pagefind-search" />
      {status === 'unavailable' && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          搜索索引尚未生成。执行 <code>npm run build</code>{' '}
          后由 Pagefind 自动建立索引，部署后即可使用。
        </p>
      )}
    </div>
  )
}
