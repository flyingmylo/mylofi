import { getAllEpisodes } from '@/lib/englishpod'

// 静态导出：构建时生成期次索引（no + title），打卡卡片按需拉取
export const dynamic = 'force-static'

export async function GET() {
  const episodes = getAllEpisodes().map((e) => ({ no: e.no, title: e.title }))
  return new Response(JSON.stringify(episodes), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
