'use client'

import { useState, useMemo } from 'react'
import { convertMarkdownToWechat, THEME_PRESETS, type ThemePreset } from '@/lib/wechat-kit/formatter'
import { Copy, Check, FileText, Sparkles } from 'lucide-react'

const SAMPLE_MD = `# 大语言模型基础：读懂智能体的大脑

> 《Hello-Agents》第三章内容总结。聚焦现代智能体的核心组件——大语言模型（LLM），解答关键问题：现代智能体是如何工作的？

## 一、从 N-gram 到 Transformer：注意力机制的胜利

语言模型的根本任务是计算词序列出现的概率。2017 年提出的 **Transformer** 架构彻底抛弃循环结构，只靠**自注意力机制**捕捉全局依赖：

- **自注意力 (Self-Attention)**：让序列中的每一个 Token 都能与全局上下文直接交互；
- **多头注意力 (Multi-Head)**：多个关注头分别捕捉语义、语法与指代关系；
- **自回归接龙 (Decoder-Only)**：核心逻辑即为“预测下一个最可能的词元”。

## 二、模型选型对比

| 架构阵营 | 代表模型 | 核心特点 |
|---|---|---|
| 闭源前沿 | GPT-4o, Claude 3.5, Gemini 1.5 | 顶尖能力，开箱即用稳定 API |
| 开源自主 | Llama 3, Qwen 2.5, DeepSeek | 可私有化部署定制，数据完全自主 |

## 三、智能体思考与行动回路

\`\`\`flow
[感知识别] 接收外部环境多模态输入与用户指令
↓ (格式化为标准 Prompt)
[规划中枢] 基于 LLM 进行任务拆解与思维链推理
↓ (调用外部 API / 知识库)
[工具执行] 运行代码解释器或检索向量知识库
↓ (整合结果生成响应)
[反馈闭环] 将执行结果写入短期记忆并输出给用户
\`\`\`

---

所谓智能体，就是为大语言模型装上**记忆、规划与工具调用**的外挂手脚。`

export function FormatPanel() {
  const [markdown, setMarkdown] = useState(SAMPLE_MD)
  const [theme, setTheme] = useState<ThemePreset>('navy')
  const [copied, setCopied] = useState(false)

  // 实时转换 HTML
  const htmlResult = useMemo(() => {
    return convertMarkdownToWechat(markdown, theme)
  }, [markdown, theme])

  // 复制富文本到剪贴板（微信公众号编辑器专用格式）
  const handleCopyToWechat = async () => {
    try {
      // 剥离外层 max-width/margin 等预览布局属性，保留视觉内联样式
      const cleanHtml = htmlResult
        .replace(/max-width:[^;]*;?/g, '')
        .replace(/margin:0 auto;?/g, '')

      const blobHtml = new Blob([cleanHtml], { type: 'text/html' })
      const blobText = new Blob([markdown], { type: 'text/plain' })

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText,
          }),
        ])
      } else {
        // 降级方案
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = cleanHtml
        tempDiv.style.position = 'fixed'
        tempDiv.style.left = '-9999px'
        document.body.appendChild(tempDiv)
        const range = document.createRange()
        range.selectNodeContents(tempDiv)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
        document.execCommand('copy')
        document.body.removeChild(tempDiv)
      }

      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请尝试在右侧手动全选复制')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 顶部工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-paper p-4 card-shadow font-mono text-xs">
        {/* 主题选择器 */}
        <div className="flex items-center gap-3">
          <span className="text-muted tracking-wider">排版主题：</span>
          <div className="flex gap-2">
            {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((tKey) => {
              const info = THEME_PRESETS[tKey]
              const active = theme === tKey
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setTheme(tKey)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-all ${
                    active
                      ? 'border-accent bg-accent/10 text-ink font-semibold shadow-xs'
                      : 'border-line text-muted hover:text-ink hover:border-muted'
                  }`}
                >
                  <span
                    className="size-3 rounded-full border border-black/10"
                    style={{ backgroundColor: info.hex }}
                  />
                  <span>{info.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 快捷动作 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMarkdown(SAMPLE_MD)}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-muted hover:text-ink hover:border-muted transition-colors"
          >
            <Sparkles className="size-3.5" />
            <span>示例</span>
          </button>

          <button
            type="button"
            onClick={handleCopyToWechat}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 font-medium transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-ink text-paper hover:opacity-90 active:scale-98 shadow-sm'
            }`}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span>{copied ? '已复制！可直接粘贴微信' : '复制到公众号'}</span>
          </button>
        </div>
      </div>

      {/* 双栏工作区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* 左栏：Markdown 输入区 */}
        <div className="flex flex-col h-[600px] rounded-xl border border-line bg-paper card-shadow overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2.5 bg-muted/5">
            <span className="font-mono text-xs text-muted tracking-wider flex items-center gap-1.5">
              <FileText className="size-3.5" />
              MARKDOWN 输入
            </span>
            <span className="font-mono text-[11px] text-muted">{markdown.length} 字</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="在此粘贴或输入 Markdown 正文..."
            className="flex-1 min-h-0 w-full resize-none p-4 font-mono text-sm leading-relaxed text-ink bg-transparent focus:outline-hidden overflow-y-auto overscroll-y-contain [overscroll-behavior:contain]"
          />
        </div>

        {/* 右栏：微信排版即时预览 */}
        <div className="flex flex-col h-[600px] rounded-xl border border-line bg-paper card-shadow overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2.5 bg-muted/5">
            <span className="font-mono text-xs text-muted tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              微信公众号富文本即时预览
            </span>
            <span className="font-mono text-[11px] text-muted">INLINE STYLES</span>
          </div>

          <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto overscroll-y-contain [overscroll-behavior:contain] bg-[#f8f9fa] dark:bg-[#111317]">
            {/* 模拟手机/微信阅读宽度容器 */}
            <div
              className="mx-auto rounded-xl p-4 bg-white dark:bg-[#1a1d24] shadow-sm transition-all"
              dangerouslySetInnerHTML={{ __html: htmlResult }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
