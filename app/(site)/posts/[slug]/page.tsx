import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost } from '@/lib/posts'
import { GiscusComments } from '@/components/giscus-comments'

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

  return (
    <div className="mx-auto max-w-2xl">
      <article data-pagefind-body>
        <header className="mb-14">
          <h1 className="font-serif text-3xl leading-snug font-semibold tracking-tight sm:text-[2.5rem] sm:leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 font-mono text-[11px] text-muted">
            <time>{post.date.replace(/-/g, '.')}</time>
            <span>{post.readingTime}</span>
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
        </header>

        <div
          className="prose max-w-none prose-headings:tracking-tight prose-a:underline-offset-4 hover:prose-a:decoration-accent prose-img:rounded-md prose-blockquote:not-italic prose-blockquote:font-serif prose-hr:border-line"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

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
