// 游乐场工具注册表：新增工具时在此登记一行，/playground 的工具自动出现
export type PlaygroundTool = {
  slug: string
  name: string
  description: string
}

export const tools: PlaygroundTool[] = [
  {
    slug: 'englishpod',
    name: 'ENGLISHPOD',
    description: '365 期精听档案：对话、词汇要点与播客全文',
  },
  {
    slug: 'wechat-kit',
    name: 'WECHAT-KIT',
    description: '微信公众号排版与高清矢量封面生成器',
  },
]
