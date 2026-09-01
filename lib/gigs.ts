import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type Gig = {
  slug: string
  /** 乐队 / 演出名 */
  band: string
  /** 巡演或专场名 */
  tour: string
  /** YYYY-MM-DD */
  date: string
  venue: string
  city: string
  price: string
  /** 一句话现场笔记 */
  note: string
  /** 演出日期晚于构建日 → 即将上演。静态站点按构建时刻快照，跨天需重新部署翻转 */
  upcoming: boolean
  /** 票根编号：G-年份-当年序号（按日期升序） */
  stub: string
}

const gigsDir = path.join(process.cwd(), 'content', 'gigs')

function parseFile(filename: string): Gig | null {
  // _ 开头视为模板/草稿；README 是字段说明文档，均不发布
  if (filename.startsWith('_') || filename === 'README.md') return null
  const raw = fs.readFileSync(path.join(gigsDir, filename), 'utf-8')
  // 只认以 frontmatter 开头的文件，防止正文里的示例 yaml 被日期正则误匹配
  if (!raw.trimStart().startsWith('---')) return null
  const { data } = matter(raw)
  // 从原始 frontmatter 文本提取日期，避免 YAML 解析成 Date 后时区偏移（同 posts.ts）
  const date = raw.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? ''
  if (!date) return null
  return {
    slug: filename.replace(/\.md$/, ''),
    band: (data.title as string) ?? '',
    tour: (data.tour as string) ?? '',
    date,
    venue: (data.venue as string) ?? '',
    city: (data.city as string) ?? '',
    price: (data.price as string) ?? '',
    note: (data.note as string) ?? '',
    upcoming: false,
    stub: '',
  }
}

/** 全部演出（按日期倒序：最近的贴在最上面） */
export function getAllGigs(): Gig[] {
  if (!fs.existsSync(gigsDir)) return []
  const all = fs
    .readdirSync(gigsDir)
    .map(parseFile)
    .filter((g): g is Gig => g !== null)

  // 票根编号与上演状态：同年内按日期升序编号，编号一旦生成不随排序变化
  const today = new Date().toISOString().slice(0, 10)
  const counters = new Map<string, number>()
  const asc = [...all].sort((a, b) => (a.date > b.date ? 1 : -1))
  for (const g of asc) {
    const year = g.date.slice(0, 4)
    const next = (counters.get(year) ?? 0) + 1
    counters.set(year, next)
    g.stub = `G-${year}-${String(next).padStart(3, '0')}`
    g.upcoming = g.date >= today
  }
  return asc.reverse()
}

/** 最近一场未上演的演出（首页侧栏「下一场」用） */
export function getNextGig(): Gig | undefined {
  return getAllGigs().find((g) => g.upcoming)
}
