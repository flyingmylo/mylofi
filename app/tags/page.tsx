import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = { title: '标签' }

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <h1 className="mb-10 text-3xl font-bold tracking-tight">标签</h1>
      {tags.length === 0 ? (
        <p className="text-neutral-500">还没有标签。</p>
      ) : (
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="group font-mono text-sm text-neutral-500 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
            >
              <span className="text-indigo-600/60 dark:text-indigo-400/60">#</span>
              {tag}
              <span className="ml-1 text-xs text-neutral-300 dark:text-neutral-600">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
