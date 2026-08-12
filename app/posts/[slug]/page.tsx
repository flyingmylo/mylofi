import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate, getAllPosts, getPost } from '@/lib/posts'
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
    <div>
      <article data-pagefind-body>
        <header className="mb-12">
          <h1 className="text-3xl leading-snug font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-neutral-400 dark:text-neutral-500">
            <time>{formatDate(post.date)}</time>
            <span>{post.readingTime}</span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}/`}
                className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <div
          className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-indigo-600 prose-a:decoration-indigo-300 prose-a:underline-offset-4 dark:prose-a:text-indigo-400 dark:prose-a:decoration-indigo-500/50 prose-img:rounded-xl prose-pre:border prose-pre:border-neutral-200 prose-pre:bg-transparent prose-pre:p-0 dark:prose-pre:border-neutral-800 prose-blockquote:border-l-indigo-400 prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <div className="mt-16 border-t border-neutral-200/70 pt-10 dark:border-neutral-800/70">
        <GiscusComments />
      </div>

      <div className="mt-12 font-mono text-sm">
        <Link
          href="/"
          className="text-neutral-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          ← cd ..
        </Link>
      </div>
    </div>
  )
}
