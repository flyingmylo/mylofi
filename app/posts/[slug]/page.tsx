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
    <div>
      <article data-pagefind-body>
        <header className="mb-12">
          <p className="font-mono text-xs text-muted">
            [{post.date}] · {post.readingTime}
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-snug font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-dashed border-line pt-4 font-mono text-xs">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}/`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose max-w-none prose-headings:tracking-tight prose-a:decoration-accent/40 prose-a:underline-offset-4 hover:prose-a:decoration-accent prose-img:rounded-md prose-img:border prose-img:border-line prose-blockquote:not-italic prose-hr:border-dashed"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <div className="mt-16 border-t border-dashed border-line pt-10">
        <GiscusComments />
      </div>

      <div className="mt-12 font-mono text-sm">
        <Link href="/" className="text-muted transition-colors hover:text-accent">
          ← cd ..
        </Link>
      </div>
    </div>
  )
}
