// 游乐场工具注册表：新增工具时在此登记一行，/playground 列表自动出现
export type PlaygroundTool = {
  slug: string
  name: string
  description: string
}

export const tools: PlaygroundTool[] = [
  {
    slug: 'englishpod',
    name: 'Englishpod',
    description: 'EnglishPod 播客 365 期档案：对话、词汇要点与播客全文',
  },
]
