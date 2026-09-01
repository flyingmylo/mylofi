import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost } from '@/lib/posts'
import { GiscusComments } from '@/components/giscus-comments'
import { PostCard } from '@/components/post-card'
import { ReadingProgress } from '@/components/reading-progress'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: 'article', publishedTime: post.date, tags: post.tags },
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // B-Sides：共享标签最多的另外两篇，按 tag 重合数排序
  const bSides = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ post: p, overlap: p.tags.filter((t) => post.tags.includes(t)).length }))
    .filter((p) => p.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, 2)
    .map((p) => p.post)

  return (
    <div className="mx-auto max-w-2xl">
      <ReadingProgress />

      <article data-pagefind-body>
        <header className="mb-12">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-muted">
            <span className="text-accent">{post.catalog}</span>
            <time>{post.date.replaceAll('-', '.')}</time>
            <span>{post.minutes} MIN</span>
          </div>
          <h1 className="mt-5 font-serif text-3xl leading-snug font-semibold tracking-tight sm:text-[2.5rem] sm:leading-tight">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 font-mono text-[11px] text-muted">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}/`}
                  className="transition-colors hover:text-accent"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-track max-w-none prose-headings:tracking-tight prose-a:underline-offset-4 hover:prose-a:decoration-accent prose-img:rounded-md prose-blockquote:not-italic prose-blockquote:font-serif prose-hr:border-line"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      {bSides.length > 0 && (
        <div className="mt-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            B-Sides · 延伸曲目
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {bSides.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-20 border-t border-line/70 pt-10">
        <GiscusComments />
      </div>

      <div className="mt-12 font-mono text-xs">
        <Link href="/" className="text-muted transition-colors hover:text-accent">
          ← 返回索引
        </Link>
      </div>
    </div>
  )
}
