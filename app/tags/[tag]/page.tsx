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
      <h1 className="mb-8 font-mono text-2xl font-bold tracking-tight">
        <span className="text-indigo-600 dark:text-indigo-400">#</span>
        {tag}
        <span className="ml-3 text-sm font-normal text-neutral-400">
          {posts.length} 篇
        </span>
      </h1>
      <div className="flex flex-col divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
