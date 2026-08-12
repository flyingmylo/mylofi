import Link from 'next/link'
import { formatDate, type PostMeta } from '@/lib/posts'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-6">
      <Link href={`/posts/${post.slug}/`} className="block">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h3>
          <time className="shrink-0 text-sm text-neutral-500 tabular-nums dark:text-neutral-400">
            {formatDate(post.date)}
          </time>
        </div>
        {post.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {post.summary}
          </p>
        )}
      </Link>
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
