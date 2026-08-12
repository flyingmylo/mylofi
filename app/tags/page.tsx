import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = { title: '标签' }

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <p className="font-mono text-xs text-accent">{"// tags"}</p>
      <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight">标签</h1>
      {tags.length === 0 ? (
        <p className="mt-8 text-muted">还没有标签。</p>
      ) : (
        /* 交错位移 + 毛玻璃 chip，打破呆板网格 */
        <div className="mt-10 flex flex-wrap gap-x-4 gap-y-4 [&>a:nth-child(3n+2)]:translate-y-2 [&>a:nth-child(4n)]:-translate-y-1">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="rounded-lg border border-line bg-paper/50 px-4 py-2 font-mono text-sm text-muted shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <span className="text-accent/70">#</span>
              {tag}
              <span className="ml-1.5 text-xs opacity-60">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
