import { getAllPosts, type PostMeta } from '@/lib/posts'
import { PostCard } from '@/components/post-card'

function groupByYear(posts: PostMeta[]): [string, PostMeta[]][] {
  const map = new Map<string, PostMeta[]>()
  for (const post of posts) {
    const year = post.date.slice(0, 4) || '未注明日期'
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

export default function HomePage() {
  const groups = groupByYear(getAllPosts())

  if (groups.length === 0) {
    return (
      <p className="text-muted">
        还没有文章，去 <code>content/posts/</code> 写一篇吧。
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-14">
      {groups.map(([year, posts]) => (
        <section key={year}>
          <h2 className="font-serif text-lg text-muted italic">{year}</h2>
          <div className="mt-3 flex flex-col divide-y divide-line/70 border-y border-line/70">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
