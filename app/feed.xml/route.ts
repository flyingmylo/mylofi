import { Feed } from 'feed'
import { getAllPosts, getPost } from '@/lib/posts'
import { site } from '@/lib/site'

// 静态导出：构建时生成 feed.xml
export const dynamic = 'force-static'

export async function GET() {
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.url,
    link: site.url,
    language: site.locale,
    favicon: `${site.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${site.author}`,
    author: { name: site.author },
  })

  for (const meta of getAllPosts()) {
    const post = await getPost(meta.slug)
    if (!post) continue
    feed.addItem({
      title: post.title,
      id: `${site.url}/posts/${post.slug}/`,
      link: `${site.url}/posts/${post.slug}/`,
      description: post.summary,
      content: post.html,
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
    })
  }

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
