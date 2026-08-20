import fs from 'node:fs'
import path from 'node:path'
import { episodeSlug } from './englishpod-utils'

/**
 * EnglishPod 数据访问层。
 * 数据源：content/englishpod/md/englishpod_0001..0365.md（构建时解析）
 * 播客全文在 public/englishpod/txt/，由浏览器按需 fetch。
 */

export type EpisodeMeta = {
  no: number
  category: string
  title: string
}

export type DialogueTurn = {
  speaker: string
  text: string
}

export type VocabEntry = {
  term: string
  pos: string
  def: string
}

export type Episode = EpisodeMeta & {
  dialogue: DialogueTurn[]
  keyVocab: VocabEntry[]
  suppVocab: VocabEntry[]
}

const mdDir = path.join(process.cwd(), 'content', 'englishpod', 'md')

/** 每组期数（分组浏览） */
export const GROUP_SIZE = 50

function parseMeta(filename: string): EpisodeMeta | null {
  const m = filename.match(/^englishpod_(\d{4})\.md$/)
  if (!m) return null
  const raw = fs.readFileSync(path.join(mdDir, filename), 'utf-8')
  const head = raw.match(/^#\s+(.+)$/m)?.[1] ?? ''
  const sep = head.indexOf(' - ')
  return {
    no: Number(m[1]),
    category: sep > 0 ? head.slice(0, sep) : '',
    title: sep > 0 ? head.slice(sep + 3) : head,
  }
}

let episodesCache: EpisodeMeta[] | null = null
let episodesCacheKey = ''

/**
 * 全部期次元信息（按期号升序）。
 * 以文件 mtime 拼接为缓存键：重复调用只 stat 不重读解析，
 * dev 下编辑 md 内容后缓存自动失效，无需重启。
 */
export function getAllEpisodes(): EpisodeMeta[] {
  if (!fs.existsSync(mdDir)) return []
  const filenames = fs.readdirSync(mdDir).sort()
  const key = filenames
    .map((f) => `${f}:${fs.statSync(path.join(mdDir, f)).mtimeMs}`)
    .join('|')
  if (episodesCache && key === episodesCacheKey) return episodesCache
  episodesCache = filenames
    .map(parseMeta)
    .filter((e): e is EpisodeMeta => e !== null)
    .sort((a, b) => a.no - b.no)
  episodesCacheKey = key
  return episodesCache
}

/** 所有分类及期数（按期数降序） */
export function getCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const e of getAllEpisodes()) {
    if (!e.category) continue
    map.set(e.category, (map.get(e.category) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function getGroupCount(): number {
  return Math.ceil(getAllEpisodes().length / GROUP_SIZE)
}

export type GroupRange = { start: number; end: number }

export function getGroupRange(group: number): GroupRange {
  const episodes = getAllEpisodes()
  const last = episodes.length ? episodes[episodes.length - 1].no : 0
  return {
    start: (group - 1) * GROUP_SIZE + 1,
    end: Math.min(group * GROUP_SIZE, last),
  }
}

export function getEpisodesInGroup(group: number): EpisodeMeta[] {
  const { start, end } = getGroupRange(group)
  return getAllEpisodes().filter((e) => e.no >= start && e.no <= end)
}

const dialogueRe = /^\*\*([A-Z]):\*\*\s*(.*)$/
const vocabRe = /^- \*\*(.+?)\*\* \*(.+?)\*(?:\s+—\s+(.*))?$/

/** 修复源数据 PDF 提取留下的连字符断词（"yes- terday" → "yesterday"），仅作用于行内 */
function dehyphenate(s: string): string {
  return s.replace(/([a-z])- ([a-z])/g, '$1$2')
}

/**
 * 解析词汇区块行。
 * 源数据有少量「一个词条被拆成两行」的断行脏数据（如 office equip + ment、
 * apple + cider），四种断口信号：残片行无释义、上行释义以连字符断词结尾、
 * 上行词性以逗号结尾、上行词性括号未闭合。命中任一即并入上一词条。
 */
function parseVocabBlock(lines: string[]): VocabEntry[] {
  const entries: VocabEntry[] = []
  for (const line of lines) {
    const m = line.match(vocabRe)
    if (!m) continue
    const [, term, pos, def = ''] = m
    const prev = entries[entries.length - 1]
    const isFragment =
      prev !== undefined &&
      (!def ||
        prev.def.endsWith('-') ||
        prev.pos.endsWith(',') ||
        (prev.pos.includes('(') && !prev.pos.includes(')')))
    if (isFragment) {
      prev.term += ` ${term}`
      // 词性括号被拆开时去除空格拼接（"Noun (plu" + "ral)" → "Noun (plural)"）
      prev.pos = prev.pos.includes('(') && !prev.pos.includes(')')
        ? prev.pos + pos
        : `${prev.pos} ${pos}`
      // 释义中的连字符断词（"unsweet-" + "ened" → "unsweetened"）
      prev.def =
        def && prev.def.endsWith('-')
          ? prev.def.slice(0, -1) + def
          : def && prev.def
            ? `${prev.def} ${def}`
            : prev.def
    } else {
      entries.push({ term, pos, def })
    }
  }
  return entries.map((e) => ({ ...e, def: dehyphenate(e.def) }))
}

/** 单期完整数据（对话 + 两类词汇表），不存在返回 null */
export function getEpisode(no: number): Episode | null {
  const file = path.join(mdDir, `englishpod_${episodeSlug(no)}.md`)
  if (!fs.existsSync(file)) return null
  const meta = parseMeta(`englishpod_${episodeSlug(no)}.md`)!

  const dialogue: DialogueTurn[] = []
  const keyVocab: VocabEntry[] = []
  const suppVocab: VocabEntry[] = []
  let section: 'dialogue' | 'key' | 'supp' = 'dialogue'
  let vocabBuffer: string[] = []

  const flushVocab = () => {
    if (section === 'key') keyVocab.push(...parseVocabBlock(vocabBuffer))
    if (section === 'supp') suppVocab.push(...parseVocabBlock(vocabBuffer))
    vocabBuffer = []
  }

  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    if (line.startsWith('## ')) {
      flushVocab()
      const head = line.slice(3).trim()
      section = head === 'Key Vocabulary' ? 'key' : head === 'Supplementary Vocabulary' ? 'supp' : 'dialogue'
      continue
    }
    if (section === 'dialogue') {
      const m = line.match(dialogueRe)
      if (m) dialogue.push({ speaker: m[1], text: dehyphenate(m[2]) })
    } else {
      vocabBuffer.push(line)
    }
  }
  flushVocab()

  return { ...meta, dialogue, keyVocab, suppVocab }
}
