import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'
import { PostCard } from '@/components/post-card'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div>
      {/* Hero：衬线大标题 + 微倾斜的毛玻璃卡片 */}
      <section className="mb-16">
        <p className="font-mono text-xs text-accent">{"// hello, world"}</p>
        <h1 className="mt-5 font-serif text-5xl leading-tight font-bold tracking-tight sm:text-6xl">
          我是 {site.author}
          <span className="text-accent">。</span>
        </h1>
        <div className="mt-8 max-w-md -rotate-1 rounded-xl border border-line bg-paper/50 p-5 shadow-sm backdrop-blur-md transition-transform duration-300 hover:rotate-0">
          <p className="text-sm leading-relaxed text-muted">
            {site.description}
            <br />
            在这里写技术，也写生活。
          </p>
        </div>
      </section>

      {/* 文章列表：奇偶交错缩进的非对称节奏 */}
      <section>
        <div className="mb-4 flex items-center gap-4">
          <h2 className="shrink-0 font-mono text-xs tracking-widest text-muted uppercase">
            ▚ 最近文章 · {posts.length}
          </h2>
          <div className="h-px w-full border-t border-dashed border-line" />
        </div>
        {posts.length === 0 ? (
          <p className="text-muted">
            还没有文章，去 <code>content/posts/</code> 写一篇吧。
          </p>
        ) : (
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} offset={i % 2 === 1} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
