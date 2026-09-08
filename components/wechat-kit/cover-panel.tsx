'use client'

import { useState, useMemo } from 'react'
import {
  generateCoverSvg,
  exportSvgToPngBlob,
  COVER_STYLES,
  COVER_THEMES,
  type CoverStyle,
  type CoverTheme,
} from '@/lib/wechat-kit/cover-svg'
import { Download, Sparkles, RefreshCw, Check } from 'lucide-react'

export function CoverPanel() {
  const [eyebrow, setEyebrow] = useState('HELLO-AGENTS · 第三章')
  const [titleLine1, setTitleLine1] = useState('大语言模型基础')
  const [titleLine2, setTitleLine2] = useState('读懂智能体的大脑')
  const [subtitle, setSubtitle] = useState('全序列并行计算，注意力就是一切')
  const [style, setStyle] = useState<CoverStyle>('flat')
  const [theme, setTheme] = useState<CoverTheme>('navy')
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // 动态计算 SVG 字符串
  const svgContent = useMemo(() => {
    return generateCoverSvg({
      eyebrow,
      titleLine1,
      titleLine2,
      subtitle,
      style,
      theme,
    })
  }, [eyebrow, titleLine1, titleLine2, subtitle, style, theme])

  // 下载 1800 × 766 Retina 高清 PNG
  const handleDownloadPng = async () => {
    try {
      setDownloading(true)
      const blob = await exportSvgToPngBlob(svgContent, 2)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const fileName = `${titleLine1.replace(/\s+/g, '_')}_cover.png`
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 2500)
    } catch (err) {
      console.error('导出失败:', err)
      alert('导出高清图片失败，请稍后重试')
    } finally {
      setDownloading(false)
    }
  }

  // 快速切换预设文案
  const loadPreset = (presetIndex: number) => {
    if (presetIndex === 1) {
      setStyle('flat')
      setSubtitle('全序列并行计算，注意力就是一切')
    } else if (presetIndex === 2) {
      setStyle('blueprint')
      setSubtitle('自回归文字接龙，预测下一个词就够了')
    } else if (presetIndex === 3) {
      setStyle('iso')
      setSubtitle('参数规模促成涌现，但边界仍需工具增强')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 实时预览大屏 (2.35:1 官方比例) */}
      <div className="flex flex-col rounded-xl border border-line bg-paper card-shadow overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 bg-muted/5 font-mono text-xs">
          <span className="text-muted tracking-wider flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-accent" />
            2.35:1 官方版式 · 实时矢量预览
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted">900 × 383 (Retina 2x 导出)</span>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={downloading}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 font-medium transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-ink text-paper hover:opacity-90 active:scale-98 shadow-sm'
              }`}
            >
              {downloadSuccess ? (
                <Check className="size-3.5" />
              ) : downloading ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>{downloadSuccess ? '下载成功！' : '导出 1800×766 超清 PNG'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 flex justify-center items-center bg-[#eaeaea] dark:bg-[#0d0f12]">
          <div
            className="w-full max-w-[900px] aspect-[900/383] rounded-lg shadow-lg overflow-hidden border border-black/10 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:block"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>

      {/* 参数调控工作台 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左栏：文本内容 */}
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-5 card-shadow">
          <h2 className="font-mono text-xs tracking-wider text-muted uppercase">文本内容配置</h2>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">眉题 (Eyebrow)</label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-hidden focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">主标题第一行</label>
              <input
                type="text"
                value={titleLine1}
                onChange={(e) => setTitleLine1(e.target.value)}
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-hidden focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">主标题第二行 (可选)</label>
              <input
                type="text"
                value={titleLine2}
                onChange={(e) => setTitleLine2(e.target.value)}
                placeholder="若无第二行可留空"
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-hidden focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">副标题 (Subtitle)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink focus:outline-hidden focus:border-accent"
            />
          </div>

          {/* 快速填入视角预设 */}
          <div className="mt-2 pt-3 border-t border-line">
            <span className="block text-[11px] font-mono text-muted mb-2">快速应用视角预设：</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset(1)}
                className="rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:text-ink hover:border-muted transition-colors"
              >
                ① 定义视角（扁平·QKV）
              </button>
              <button
                type="button"
                onClick={() => loadPreset(2)}
                className="rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:text-ink hover:border-muted transition-colors"
              >
                ② 机制视角（蓝图·因果掩码）
              </button>
              <button
                type="button"
                onClick={() => loadPreset(3)}
                className="rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:text-ink hover:border-muted transition-colors"
              >
                ③ 宏观视角（等距·模型塔）
              </button>
            </div>
          </div>
        </div>

        {/* 右栏：风格与配色 */}
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-5 card-shadow">
          <h2 className="font-mono text-xs tracking-wider text-muted uppercase">视觉风格与配色</h2>

          {/* 风格切换 */}
          <div>
            <label className="block text-xs font-mono text-muted mb-2">视觉风格 (几何语言)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COVER_STYLES.map((st) => {
                const active = style === st.id
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStyle(st.id)}
                    className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                      active
                        ? 'border-accent bg-accent/5 text-ink shadow-xs'
                        : 'border-line text-muted hover:text-ink hover:border-muted'
                    }`}
                  >
                    <span className="font-mono text-xs font-medium text-ink">{st.name}</span>
                    <span className="text-[11px] text-muted mt-1 leading-snug">{st.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 色板切换 (浅底风格有效) */}
          <div className="pt-3 border-t border-line">
            <label className="block text-xs font-mono text-muted mb-2">调色板 (浅底自动微染底色)</label>
            <div className="flex gap-3">
              {(Object.keys(COVER_THEMES) as CoverTheme[]).map((tKey) => {
                const info = COVER_THEMES[tKey]
                const active = theme === tKey
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setTheme(tKey)}
                    className={`flex items-center gap-2.5 rounded-lg border px-4 py-2 text-xs font-mono transition-all ${
                      active
                        ? 'border-accent bg-accent/10 text-ink font-semibold'
                        : 'border-line text-muted hover:text-ink hover:border-muted'
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: info.accent }}
                    />
                    <span>{info.name}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-2.5 text-[11px] text-muted leading-relaxed">
              * 藏青自动微染冷淡冰蓝底（#f4f7fb），灰绿自动微染象牙米白底（#fdfcf9）。深邃暗蓝与暗色金线采用专属深黑底。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
