// 游乐场工具注册表：新增工具时在此登记一行，/playground 的踏板自动出现
export type PlaygroundTool = {
  slug: string
  name: string
  description: string
  /** 踏板计数屏文案（如 EP 365 / 25:00） */
  counter: string
}

export const tools: PlaygroundTool[] = [
  {
    slug: 'englishpod',
    name: 'ENGLISHPOD',
    description: '365 期精听档案：对话、词汇要点与播客全文',
    counter: 'EP 365',
  },
]
