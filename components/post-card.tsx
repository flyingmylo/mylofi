import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

/** 文章索引行：日期 + 标题，发丝线分隔，hover 时标题染上赭色 */
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group">
      <Link
        href={`/posts/${post.slug}/`}
        className="flex items-baseline gap-5 py-3.5 sm:gap-8"
      >
        <time className="w-[4.5rem] shrink-0 font-mono text-[11px] text-muted tabular-nums">
          {post.date.slice(2).replace(/-/g, '.')}
        </time>
        <h3 className="min-w-0 font-serif text-[17px] leading-snug transition-colors duration-200 group-hover:text-accent">
          {post.title}
        </h3>
      </Link>
    </article>
  )
}
