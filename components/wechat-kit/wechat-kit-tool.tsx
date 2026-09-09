'use client'

import Link from 'next/link'
import { FormatPanel } from './format-panel'
import { ArrowLeft } from 'lucide-react'

/**
 * WeChat Kit 微信公众号排版工作台
 * 
 * Why: 纯前端无服务端运行，将 Markdown 实时转换为符合微信公众平台内联样式（inline style）标准的富文本 HTML，
 *      并支持一键写入系统富文本剪贴板直接粘贴发布。
 */
export function WechatKitTool() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* 顶部导航与面包屑 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 font-mono text-xs">
        <Link
          href="/playground"
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>PLAYGROUND · 游乐场</span>
        </Link>
        <span className="text-muted tracking-widest text-[11px] uppercase">
          WECHAT-KIT · 公众号排版工作台
        </span>
      </div>

      {/* 标题区 */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-ink">
            WECHAT-KIT
          </h1>
          <p className="mt-2 text-sm text-muted">
            微信公众号主题化排版利器 · 纯内联样式与双黄金主题色 · 原生兼容富文本剪贴板
          </p>
        </div>
      </div>

      {/* 主面板：正文排版工作台 */}
      <div className="mt-8">
        <FormatPanel />
      </div>
    </div>
  )
}
