import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostCard } from '@/components/post-card'

type Params = { params: Promise<{ tag: string }> }

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params
  return { title: `标签：${decodeURIComponent(tag)}` }
}

export default async function TagPage({ params }: Params) {
  const { tag: raw } = await params
  const tag = decodeURIComponent(raw)
  const posts = getPostsByTag(tag)
  if (posts.length === 0) notFound()

  return (
    <div>
      <p className="font-mono text-[11px] text-muted">
        <Link href="/tags/" className="transition-colors hover:text-accent">
          标签
        </Link>
        <span className="mx-2">/</span>#{tag}
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
        {tag}
        <span className="ml-3 align-middle font-mono text-xs font-normal text-muted">
          {posts.length} 篇
        </span>
      </h1>
      <div className="mt-8 flex flex-col divide-y divide-line/70 border-y border-line/70">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
