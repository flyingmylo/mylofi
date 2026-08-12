import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'
import { PostCard } from '@/components/post-card'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div>
      <section className="mb-14">
        <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400">
          ~/hello-world
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Hi，我是 {site.author} 👋
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {site.description}
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-mono text-xs font-medium tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
          最近文章 · {posts.length} 篇
        </h2>
        {posts.length === 0 ? (
          <p className="text-neutral-500">
            还没有文章，去 <code>content/posts/</code> 写一篇吧。
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
