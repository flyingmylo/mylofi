import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/post-card'
import { FeatureCard } from '@/components/feature-card'
import { NowSpinning } from '@/components/now-spinning'
import { NextGig } from '@/components/next-gig'

/** 首页：刊物式网格——头条大卡 + 双栏曲目 + 右侧状态栏（正在转/正在读） */
export default function HomePage() {
  const posts = getAllPosts()

  if (posts.length === 0) {
    return (
      <p className="text-muted">
        还没有文章，去 <code>content/posts/</code> 写一篇吧。
      </p>
    )
  }

  const [feature, ...rest] = posts

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <FeatureCard post={feature} />
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <aside className="flex flex-col gap-6 self-start lg:sticky lg:top-24">
        <NowSpinning />
        <NextGig />
      </aside>
    </div>
  )
}
