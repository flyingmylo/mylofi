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
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <time>{formatDate(post.date)}</time>
            <span>{post.readingTime}</span>
            <span className="flex gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}/`}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  #{tag}
                </Link>
              ))}
            </span>
          </div>
        </header>

        <div
          className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-pre:p-0 prose-pre:bg-transparent"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <div className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
        <GiscusComments />
      </div>

      <div className="mt-10 text-sm">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← 返回文章列表
        </Link>
      </div>
    </div>
  )
}
