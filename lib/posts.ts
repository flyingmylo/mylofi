import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

export type PostMeta = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  draft: boolean
  readingTime: string
  /** 阅读分钟数（取整），用于「X MIN」曲目时长式展示 */
  minutes: number
  /** 目录号：时间最早编为 MYL-001，最新一期号最大 */
  catalog: string
}

export type Post = PostMeta & { html: string }

const postsDir = path.join(process.cwd(), 'content', 'posts')

function parseFile(filename: string): Omit<PostMeta, 'catalog'> & { content: string } {
  const slug = filename.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
  const { data, content } = matter(raw)
  // 从原始 frontmatter 文本提取日期，避免 YAML 解析成 Date 后时区转换导致日期偏移
  const dateMatch = raw.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)
  return {
    slug,
    title: data.title ?? slug,
    date: dateMatch ? dateMatch[1] : '',
    summary: data.summary ?? data.description ?? '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingTime: readingTime(content).text,
    minutes: Math.max(1, Math.round(readingTime(content).minutes)),
    content,
  }
}

/** 所有文章元信息（按日期倒序，生产环境过滤草稿；附目录号） */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []
  const all = fs
    .readdirSync(postsDir)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseFile)
    .filter((p) => process.env.NODE_ENV !== 'production' || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  // 目录号：倒序里第 i 篇的编号 = 总数 - i，最早一篇正好是 MYL-001
  const total = all.length
  return all.map((p, i) => ({ ...p, catalog: `MYL-${String(total - i).padStart(3, '0')}` }))
}

/** 单篇文章（含渲染后的 HTML） */
export async function getPost(slug: string): Promise<Post | null> {
  const meta = getAllPosts().find((p) => p.slug === slug)
  if (!meta) return null
  const raw = fs.readFileSync(path.join(postsDir, `${slug}.md`), 'utf-8')
  const { content } = matter(raw)
  const html = await renderMarkdown(content)
  const { content: _content, ...rest } = meta as PostMeta & { content: string }
  return { ...rest, html }
}

/** 所有标签及文章数 */
export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>()
  for (const p of getAllPosts()) {
    for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: { light: 'solarized-light', dark: 'gruvbox-dark-medium' },
      keepBackground: false,
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}
