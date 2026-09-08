import type { Metadata } from 'next'
import { WechatKitTool } from '@/components/wechat-kit/wechat-kit-tool'

export const metadata: Metadata = {
  title: 'WECHAT-KIT · 公众号排版与封面生成',
  description: '微信公众号一站式排版与高清矢量封面生成工具箱 · 纯浏览器端渲染与导出',
}

export default function WechatKitPage() {
  return <WechatKitTool />
}
