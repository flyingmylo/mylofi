import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

/**
 * 文章卡片。
 * offset=true 时（偶数位）向右缩进 + 左侧虚线，制造非对称的节奏感。
 */
export function PostCard({ post, offset = false }: { post: PostMeta; offset?: boolean }) {
  return (
    <article
      className={`group py-7 ${
        offset ? 'sm:ml-16 sm:border-l sm:border-dashed sm:border-line sm:pl-8' : ''
      }`}
    >
      <Link href={`/posts/${post.slug}/`} className="block">
        <time className="font-mono text-xs text-muted tabular-nums">
          [{post.date}]
        </time>
        <h3 className="mt-2 font-serif text-xl leading-snug font-bold tracking-tight">
          <span className="decoration-accent/60 decoration-2 underline-offset-4 transition-colors group-hover:text-accent group-hover:underline">
            {post.title}
          </span>
          <span className="ml-2 inline-block font-mono text-sm text-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </h3>
        {post.summary && (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
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
              className="font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
