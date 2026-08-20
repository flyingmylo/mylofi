import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${site.url}/posts/${post.slug}/`,
    lastModified: post.date,
  }))

  const tags = getAllTags().map(({ tag }) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}/`,
  }))

  return [
    { url: `${site.url}/` },
    { url: `${site.url}/tags/` },
    { url: `${site.url}/about/` },
    { url: `${site.url}/playground/` },
    { url: `${site.url}/playground/englishpod/` },
    ...posts,
    ...tags,
  ]
}
