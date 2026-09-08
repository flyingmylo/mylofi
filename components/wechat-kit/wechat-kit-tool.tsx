'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FormatPanel } from './format-panel'
import { CoverPanel } from './cover-panel'
import { ArrowLeft, FileText, Image as ImageIcon } from 'lucide-react'

type Tab = 'format' | 'cover'

export function WechatKitTool() {
  const [activeTab, setActiveTab] = useState<Tab>('format')

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
          WECHAT-KIT · 工作台
        </span>
      </div>

      {/* 标题区 */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-ink">
            WECHAT-KIT
          </h1>
          <p className="mt-2 text-sm text-muted">
            微信公众号一站式排版与高清矢量封面生成工具箱 · 纯浏览器端渲染与导出
          </p>
        </div>

        {/* 双选项卡切换 */}
        <div className="flex rounded-xl border border-line bg-paper p-1 font-mono text-xs card-shadow">
          <button
            type="button"
            onClick={() => setActiveTab('format')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
              activeTab === 'format'
                ? 'bg-ink text-paper font-medium shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <FileText className="size-3.5" />
            <span>正文排版</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cover')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
              activeTab === 'cover'
                ? 'bg-ink text-paper font-medium shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <ImageIcon className="size-3.5" />
            <span>封面生成</span>
          </button>
        </div>
      </div>

      {/* 主面板内容 */}
      <div className="mt-8">
        {activeTab === 'format' ? <FormatPanel /> : <CoverPanel />}
      </div>
    </div>
  )
}
