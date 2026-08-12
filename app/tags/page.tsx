import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = { title: '标签' }

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight">标签</h1>
      {tags.length === 0 ? (
        <p className="mt-8 text-muted">还没有标签。</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-line/70 border-y border-line/70">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="group flex items-baseline justify-between py-3.5"
            >
              <span className="font-mono text-sm transition-colors group-hover:text-accent">
                <span className="text-muted">#</span>
                {tag}
              </span>
              <span className="font-mono text-[11px] text-muted tabular-nums">
                {count} 篇
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
