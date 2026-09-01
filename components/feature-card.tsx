'use client'

import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'
import { useLofiPlaying } from '@/components/lofi-state'

/** 首页头条卡：左文右封面，封面上是一张随电台转动的黑胶 */
export function FeatureCard({ post }: { post: PostMeta }) {
  const playing = useLofiPlaying()
  const href = `/posts/${post.slug}/`

  return (
    <article className="card-shadow mb-4 grid overflow-hidden rounded-2xl border border-line bg-paper transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="flex flex-col p-7 sm:p-8">
        <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-[0.14em] text-muted">
          <span className="text-accent">{post.catalog}</span>
          <span>{post.date.replaceAll('-', '.')}</span>
        </div>
        <h2 className="mt-2.5 font-serif text-[2rem] leading-tight">
          <Link href={href} className="transition-colors hover:text-accent">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{post.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7 font-mono text-[10px] text-muted">
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
          <span className="tracking-[0.14em]">{post.minutes} MIN</span>
        </div>
      </div>
      <Link
        href={href}
        aria-label={post.title}
        className="feature-cover relative hidden min-h-[240px] items-center justify-center border-l border-line sm:flex"
      >
        <div
          className={`vinyl size-[150px] ${playing ? 'animate-[spin_6s_linear_infinite]' : ''}`}
        />
      </Link>
    </article>
  )
}
