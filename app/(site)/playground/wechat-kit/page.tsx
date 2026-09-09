import type { Metadata } from 'next'
import { WechatKitTool } from '@/components/wechat-kit/wechat-kit-tool'

export const metadata: Metadata = {
  title: 'WECHAT-KIT · 公众号排版工具',
  description: '微信公众号一站式主题化排版工具箱 · 纯浏览器端渲染与富文本剪贴板直接粘贴',
}

export default function WechatKitPage() {
  return <WechatKitTool />
}
