import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = { title: '标签' }

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">标签</h1>
      {tags.length === 0 ? (
        <p className="text-neutral-500">还没有标签。</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-neutral-700 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              {tag}
              <span className="ml-1.5 text-neutral-400 dark:text-neutral-500">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
