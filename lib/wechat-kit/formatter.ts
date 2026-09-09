/**
 * wechat-kit: Markdown → 微信公众号内联样式 (inline style) HTML 转换器
 * 
 * 核心特性：
 * 1. 严格遵守微信公众平台规范：全部 inline style，容器用 <section>，列表使用纯文本符号防原生标记错位；
 * 2. 双黄金标准主题色：'navy' (稳重藏青 #2b5c8f) 与 'sage' (典雅灰绿 #5f7355)；
 * 3. 自动生成 7 档透明度变体，行内代码、引用块微渐变底、分割线与表头全自动匹配。
 */

export type ThemePreset = 'navy' | 'sage'

export const THEME_PRESETS: Record<ThemePreset, { name: string; rgb: [number, number, number]; hex: string; desc: string }> = {
  navy: {
    name: '稳重藏青',
    rgb: [43, 92, 143],
    hex: '#2b5c8f',
    desc: 'AI、智能体、代码、技术架构专栏首选（权威理性、高对比度）',
  },
  sage: {
    name: '典雅灰绿',
    rgb: [95, 115, 85],
    hex: '#5f7355',
    desc: '学术论文、读书笔记、长文复盘首选（莫兰迪温润纸质感、长文耐读）',
  },
}

const FONT =
  "'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif"
const MONO = '"SF Mono", Menlo, Consolas, monospace'

function rgbStr(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function rgbaStr(rgb: [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
}

export function buildWechatStyles(theme: ThemePreset = 'navy') {
  const accent = THEME_PRESETS[theme].rgb
  const A = rgbStr(accent)

  return {
    section: `max-width:677px;margin:0 auto;padding:12px 8px;background-color:rgb(255,253,255);border-radius:12px;color:rgb(34,34,34);line-height:1.75;font-size:15px;word-wrap:break-word;font-family:${FONT};`,
    h1: `font-size:21px;font-weight:normal;color:${A};margin:0 8px 0.75em 0px;line-height:1.4em;word-break:break-all;padding:0 0 4px 8px;letter-spacing:0.5px;border-left:5px solid ${A};border-bottom:1px solid ${A};font-family:${FONT};`,
    h2: `margin:2em 8px 0.75em 0px;padding:0px 0px 0.5em 12px;border-left:4px solid ${A};border-bottom:1px dashed ${A};font-size:19px;font-weight:normal;line-height:1.2;color:rgb(63,63,63);font-family:${FONT};`,
    h3: `margin:1.5em 8px 0.6em 0px;padding:0px 0px 0.4em 10px;border-left:3px solid ${A};border-bottom:1px dotted ${A};font-size:17px;font-weight:normal;line-height:1.3;color:rgb(63,63,63);font-family:${FONT};`,
    p: `margin:1.2em 8px;text-align:justify;line-height:1.75;font-size:15px;letter-spacing:0.1em;color:rgb(34,34,34);overflow-wrap:break-word;font-family:${FONT};`,
    strong: `font-weight:bold;color:${A};font-family:${FONT};`,
    em: `font-style:italic;color:rgb(102,102,102);font-family:${FONT};`,
    // 引用块：纯色浅底微染 + 左实线边框 + 圆角（Why: 严禁使用渐变，避免在微信移动端或特定深色模式下偏色或对比度失效）
    blockquote: `margin:1.5em 8px 2em;padding:10px 12px;font-size:14px;color:rgb(63,63,63);background:${rgbaStr(accent, 0.04)};border-left:3px solid ${A};border-radius:0 6px 6px 0;line-height:1.8;font-family:${FONT};`,
    bq_p: `margin:0;text-align:left;line-height:1.75;font-size:1em;display:block;color:rgb(63,63,63);font-family:${FONT};`,
    // 分隔线：纯色细线（Why: 微信编辑器剥离部分渐变滤镜导致黑线或消失，纯色 1px 边框最稳定）
    hr: `border:none;border-top:1px solid ${rgbaStr(accent, 0.2)};height:0px;margin:2em 8px;`,
    ul: `list-style:none;margin:0em 8px 1.5em;padding:0px;text-align:left;line-height:1.75;font-size:14px;color:rgb(63,63,63);font-family:${FONT};`,
    ol: `list-style:none;margin:0em 8px 1.5em;padding:0px;text-align:left;line-height:1.75;font-size:14px;color:rgb(63,63,63);font-family:${FONT};`,
    li: `list-style:none;margin:0.5em 0px;padding:0px;text-align:left;line-height:1.75;font-size:14px;color:rgb(63,63,63);font-family:${FONT};`,
    a: `color:${A};text-decoration:none;border-bottom:1px solid ${rgbaStr(accent, 0.4)};font-family:${FONT};`,
    code: `background:${rgbaStr(accent, 0.1)};color:${A};padding:2px 6px;border-radius:3px;font-size:0.9em;font-family:${MONO};`,
    pre: `background:rgb(250,250,250);padding:14px 16px;border-radius:6px;margin:1.2em 8px;border-left:3px solid ${A};overflow-x:auto;font-size:13px;box-shadow:rgba(0,0,0,0.05) 0px 4px 6px;`,
    pre_code: `background:none;color:rgb(63,63,63);padding:0;font-family:${MONO};`,
    img: 'max-width:100%;border-radius:6px;margin:1.2em 8px;display:block;',
    table: `width:100%;border-collapse:collapse;margin:1.2em 8px;font-size:14px;font-family:${FONT};`,
    th: `border-bottom:2px solid ${A};padding:10px 12px;text-align:left;color:rgb(63,63,63);font-weight:bold;font-family:${FONT};background:${rgbaStr(accent, 0.08)};`,
    td: `border-bottom:1px solid rgb(229,229,229);padding:10px 12px;color:rgb(34,34,34);font-family:${FONT};`,
  }
}

const BULLETS = ['• ', '◦ ', '▪ ']

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseInline(text: string, styles: ReturnType<typeof buildWechatStyles>): string {
  const codeStore: string[] = []

  // 1. 保护行内代码
  let s = text.replace(/`([^`]+)`/g, (_, code) => {
    codeStore.push(escapeHtml(code))
    return `\x00CODE${codeStore.length - 1}\x00`
  })

  // 2. 转义 HTML 特殊字符
  s = escapeHtml(s)

  // 3. 链接（做协议安全校验，拦截 javascript: 等伪协议注入）
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const cleanUrl = url.trim()
    const isSafe = /^(https?:\/\/|mailto:|\/|#)/i.test(cleanUrl)
    const href = isSafe ? cleanUrl : '#'
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="${styles.a}">${label}</a>`
  })

  // 4. 加粗与斜体
  s = s.replace(/\*\*([^*]+)\*\*/g, (_, bold) => {
    return `<strong style="${styles.strong}">${bold}</strong>`
  })
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, (_, it) => {
    return `<em style="${styles.em}">${it}</em>`
  })

  // 5. 还原行内代码
  s = s.replace(/\x00CODE(\d+)\x00/g, (_, idx) => {
    return `<code style="${styles.code}">${codeStore[Number(idx)]}</code>`
  })

  return s
}

/**
 * 渲染微信原生高兼容流式步骤卡片组
 * 
 * Why: 移动端宽度有限，传统 ASCII 字符框图极易换行折断。
 *      改为微信原生 steps 卡片流（纯 section 微染浅底 + 左强调边 + 圆角 + 居中流向指示），
 *      彻底杜绝横滑割裂，达成 100% 移动端自适应。
 * Edge: 兼容带有 (流向注解) 的箭头行、[标题] 描述、**标题**：描述及普通中英文冒号分割的步骤。
 * How: 纯行内 CSS 注入，通过 section 包裹，微信富文本剪贴板原生兼容。
 */
function renderFlowBlock(
  lines: string[],
  theme: ThemePreset,
  styles: ReturnType<typeof buildWechatStyles>
): string {
  const accent = THEME_PRESETS[theme].rgb
  const A = rgbStr(accent)
  const bgTint = rgbaStr(accent, 0.04)
  const cards: string[] = []

  for (const raw of lines) {
    const ln = raw.trim()
    if (!ln) continue

    // 1. 流向指示行（包含下指箭头、流程引导符或括号注释）
    const isArrow =
      ['↓', '▼', '->', '➔', '│', '└', '├'].some((p) => ln.startsWith(p)) ||
      (ln.startsWith('(') && ln.endsWith(')')) ||
      ['↓', '▼', '➔', '->'].some((p) => ln.includes(p))

    if (isArrow) {
      const commentMatch = ln.match(/\((.*?)\)/)
      let commentText = commentMatch ? commentMatch[1] : ''
      if (!commentText) {
        const clean = ln.replace(/[↓▼➔\->| ─└├]+/g, '').trim()
        if (clean) commentText = clean
      }

      if (commentText) {
        cards.push(
          `<div style="text-align:center;color:${A};font-size:14px;line-height:1.3;margin:8px 0;font-weight:600;">` +
            `↓ <span style="font-size:12px;font-weight:normal;color:rgb(120,120,120);background:${rgbaStr(
              accent,
              0.06
            )};padding:2px 8px;border-radius:10px;margin-left:4px;display:inline-block;">${escapeHtml(
              commentText
            )}</span></div>`
        )
      } else {
        cards.push(
          `<div style="text-align:center;color:${A};font-size:15px;line-height:1.2;margin:6px 0;font-weight:600;">↓</div>`
        )
      }
      continue
    }

    // 2. 步骤卡片解析："[标题] 描述" 或 "**标题**：描述" 或 "标题: 描述"
    let cTitle = ln
    let cDesc = ''

    const bracketMatch = ln.match(/^\[(.*?)\]\s*(.*)$/)
    const boldMatch = ln.match(/^\*\*(.*?)\*\*[：:]?\s*(.*)$/)

    if (bracketMatch) {
      cTitle = bracketMatch[1].trim()
      cDesc = bracketMatch[2].trim()
    } else if (boldMatch) {
      cTitle = boldMatch[1].trim()
      cDesc = boldMatch[2].trim()
    } else if (ln.includes('：') || ln.includes(': ')) {
      const sep = ln.includes('：') ? '：' : ': '
      const parts = ln.split(sep)
      cTitle = parts[0].trim()
      cDesc = parts.slice(1).join(sep).trim()
    }

    const titleParsed = parseInline(cTitle, styles)
    const descParsed = cDesc ? parseInline(cDesc, styles) : ''
    const descBlock = descParsed
      ? `<div style="color:rgb(63,63,63);font-size:13.5px;line-height:1.65;margin-top:5px;text-align:left;">${descParsed}</div>`
      : ''

    cards.push(
      `<section style="background:${bgTint};border-left:3.5px solid ${A};border-radius:0 8px 8px 0;padding:11px 14px;margin:5px 0;box-sizing:border-box;box-shadow:rgba(0,0,0,0.02) 0px 1px 3px;">` +
        `<div style="font-weight:bold;color:${A};font-size:14px;line-height:1.4;text-align:left;">${titleParsed}</div>` +
        `${descBlock}` +
      `</section>`
    )
  }

  return `<section style="margin:1.5em 8px;padding:0;box-sizing:border-box;">${cards.join('')}</section>`
}

/**
 * 将输入的 Markdown 转换成完整的微信公众号 Section HTML 片段
 */
export function convertMarkdownToWechat(mdText: string, theme: ThemePreset = 'navy'): string {
  const styles = buildWechatStyles(theme)
  const lines = mdText.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let i = 0
  const n = lines.length

  let paraBuf: string[] = []
  function flushPara() {
    if (paraBuf.length > 0) {
      out.push(`<p style="${styles.p}">${parseInline(paraBuf.join(' '), styles)}</p>`)
      paraBuf = []
    }
  }

  while (i < n) {
    const line = lines[i]

    // 空行
    if (line.trim() === '') {
      flushPara()
      i++
      continue
    }

    // 代码块与 flow 流程图语法块拦截
    const fenceM = line.match(/^(```|~~~)(.*)$/)
    if (fenceM) {
      flushPara()
      const langTag = fenceM[2].trim().toLowerCase()
      const codeLines: string[] = []
      i++
      while (i < n && !lines[i].match(/^(```|~~~)/)) {
        codeLines.push(lines[i])
        i++
      }
      i++ // 跳过闭合 ```

      // 识别流式步骤图语法：flow, steps, cards, workflow
      if (['flow', 'steps', 'cards', 'workflow'].includes(langTag)) {
        out.push(renderFlowBlock(codeLines, theme, styles))
      } else {
        const codeEscaped = escapeHtml(codeLines.join('\n'))
        out.push(
          `<pre style="${styles.pre}"><code style="${styles.pre_code}">${codeEscaped}</code></pre>`
        )
      }
      continue
    }

    // ATX 标题
    const atxM = line.match(/^(#{1,6})\s+(.*)$/)
    if (atxM) {
      flushPara()
      const level = Math.min(atxM[1].length, 3)
      const hText = parseInline(atxM[2].trim(), styles)
      const hStyle = level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3
      out.push(`<h${level} style="${hStyle}">${hText}</h${level}>`)
      i++
      continue
    }

    // 分隔线
    if (line.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
      flushPara()
      out.push(`<hr style="${styles.hr}">`)
      i++
      continue
    }

    // 引用块
    if (line.trimStart().startsWith('>')) {
      flushPara()
      const bqLines: string[] = []
      while (i < n && lines[i].trimStart().startsWith('>')) {
        bqLines.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      const bqParas: string[] = []
      let cur: string[] = []
      for (const bl of bqLines) {
        if (bl.trim() === '') {
          if (cur.length > 0) {
            bqParas.push(cur.join(' '))
            cur = []
          }
        } else {
          cur.push(bl)
        }
      }
      if (cur.length > 0) bqParas.push(cur.join(' '))
      const inner = bqParas
        .map((p) => `<p style="${styles.bq_p}">${parseInline(p, styles)}</p>`)
        .join('')
      out.push(`<blockquote style="${styles.blockquote}">${inner}</blockquote>`)
      continue
    }

    // 列表 (无序/有序)
    const ulM = line.match(/^(\s*)[-*+]\s+(.*)$/)
    const olM = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
    if (ulM || olM) {
      flushPara()
      const isUl = Boolean(ulM)
      const items: { indent: number; text: string }[] = []
      while (i < n) {
        const ln = lines[i]
        if (ln.trim() === '') {
          if (i + 1 < n && (lines[i + 1].match(/^(\s*)[-*+]\s+/) || lines[i + 1].match(/^(\s*)\d+\.\s+/))) {
            i++
            continue
          }
          break
        }
        const m = isUl ? ln.match(/^(\s*)[-*+]\s+(.*)$/) : ln.match(/^(\s*)\d+\.\s+(.*)$/)
        if (!m) break
        items.push({ indent: m[1].length, text: m[2] })
        i++
      }
      const baseIndent = items.reduce((min, it) => Math.min(min, it.indent), 999)
      const liHtmls = items.map((it, idx) => {
        const depth = Math.max(0, Math.floor((it.indent - baseIndent) / 2))
        const prefix = isUl ? BULLETS[Math.min(depth, BULLETS.length - 1)] : `${idx + 1}. `
        return `<li style="${styles.li}">${prefix}${parseInline(it.text, styles)}</li>`
      })
      const listTag = isUl ? 'ul' : 'ol'
      const listStyle = isUl ? styles.ul : styles.ol
      out.push(`<${listTag} style="${listStyle}">${liHtmls.join('')}</${listTag}>`)
      continue
    }

    // 表格
    if (line.includes('|') && i + 1 < n && lines[i + 1].match(/^\s*\|?[\s:|-]+\|?\s*$/)) {
      flushPara()
      const rows: string[][] = []
      while (i < n && lines[i].includes('|') && lines[i].trim() !== '') {
        const cells = lines[i]
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim())
        rows.push(cells)
        i++
      }
      if (rows.length >= 2) {
        const header = rows[0]
        const body = rows.slice(2)
        const thead = `<tr>${header.map((c) => `<th style="${styles.th}">${parseInline(c, styles)}</th>`).join('')}</tr>`
        const tbody = body
          .map((r) => `<tr>${r.map((c) => `<td style="${styles.td}">${parseInline(c, styles)}</td>`).join('')}</tr>`)
          .join('')
        out.push(`<table style="${styles.table}"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`)
      }
      continue
    }

    // 单行图片
    const imgM = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgM) {
      flushPara()
      const alt = escapeHtml(imgM[1])
      const srcUrl = imgM[2].trim()
      const isSafe = /^(https?:\/\/|data:image\/|\/)/i.test(srcUrl)
      if (isSafe) {
        out.push(`<img src="${escapeHtml(srcUrl)}" alt="${alt}" style="${styles.img}">`)
      }
      i++
      continue
    }

    // 普通文本行
    paraBuf.push(line.trim())
    i++
  }

  flushPara()

  return `<section style="${styles.section}">${out.join('')}</section>`
}
