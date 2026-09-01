import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

/** 刊物网格卡片：目录号 + 日期 + 标题 + 摘要 + 标签/时长，悬停轻微上浮 */
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="card-shadow group flex flex-col gap-2 rounded-xl border border-line bg-paper p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-[0.14em] text-muted">
        <span className="text-accent">{post.catalog}</span>
        <time>{post.date.replaceAll('-', '.')}</time>
      </div>
      <h3 className="min-w-0 font-serif text-xl leading-snug">
        <Link href={`/posts/${post.slug}/`} className="transition-colors group-hover:text-accent">
          {post.title}
        </Link>
      </h3>
      <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted">{post.summary}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2 font-mono text-[10px] text-muted">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="rounded-full border border-line px-2 py-0.5 tracking-[0.12em] transition-colors hover:border-accent hover:text-accent"
            >
              {tag}
            </Link>
          ))}
        </div>
        <span className="shrink-0 tracking-[0.14em]">{post.minutes} MIN</span>
      </div>
    </article>
  )
}
