import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-6 first:pt-4">
      <Link href={`/posts/${post.slug}/`} className="block">
        <time className="font-mono text-xs text-neutral-400 tabular-nums dark:text-neutral-500">
          {post.date}
        </time>
        <h3 className="mt-1.5 flex items-center gap-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {post.title}
          <ArrowRight
            size={16}
            className="shrink-0 -translate-x-1 text-indigo-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400"
          />
        </h3>
        {post.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {post.summary}
          </p>
        )}
      </Link>
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="font-mono text-xs text-neutral-400 transition-colors hover:text-indigo-600 dark:text-neutral-500 dark:hover:text-indigo-400"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
