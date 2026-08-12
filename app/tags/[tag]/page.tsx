import type { Metadata } from 'next'
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
      <h1 className="font-mono text-2xl font-bold tracking-tight">
        <span className="text-accent">#</span>
        {tag}
        <span className="ml-3 text-sm font-normal text-muted">
          {posts.length} 篇
        </span>
      </h1>
      <div className="mt-8 flex flex-col">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} offset={i % 2 === 1} />
        ))}
      </div>
    </div>
  )
}
