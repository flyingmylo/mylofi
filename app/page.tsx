import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'
import { PostCard } from '@/components/post-card'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">{site.title}</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          {site.description}
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          最新文章
        </h2>
        {posts.length === 0 ? (
          <p className="text-neutral-500">
            还没有文章，去 <code>content/posts/</code> 写一篇吧。
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
