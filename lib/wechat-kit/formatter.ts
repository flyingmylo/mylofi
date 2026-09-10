/**
 * wechat-kit: Markdown → 微信公众号内联样式 (inline style) HTML 转换器
 *
 * 与 ai-assistant/skills/wechat-kit/scripts/convert.py 排版引擎保持同步的浏览器端移植版：
 * 1. 严格遵守微信公众平台规范：全部 inline style，容器用 <section>，列表使用纯文本符号防原生标记错位；
 * 2. 双黄金标准主题色：'navy'（稳重藏青 #2b5c8f）与 'sage'（典雅松绿 #1d6b52），透明度变体自动推导；
 * 3. 正文外链不渲染 <a>（微信正文外链不可点）：锚文本 + 主色上标序号，文末自动生成「参考链接」卡；
 * 4. [!tip]/[!warn]/[!note] 类型化 Callout、零依赖正则级代码高亮（python/js/ts/json/bash）、
 *    flow 流式步骤卡片组（微染大底盒 + 白底分层卡片，移动端零横滑）。
 */

export type ThemePreset = 'navy' | 'sage'

type Rgb = [number, number, number]

export const THEME_PRESETS: Record<
  ThemePreset,
  { name: string; rgb: Rgb; hex: string; desc: string }
> = {
  navy: {
    name: '稳重藏青',
    rgb: [43, 92, 143],
    hex: '#2b5c8f',
    desc: 'AI 大模型、智能体、系统架构、工程代码首选（权威理性、对比度极佳）',
  },
  sage: {
    name: '典雅松绿',
    rgb: [29, 107, 82],
    hex: '#1d6b52',
    desc: '学术论文、读书笔记、长文复盘、方法论探讨首选（松林沉静感、长文耐读）',
  },
}

const FONT =
  "'PingFang SC', -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif"
const MONO = "'SF Mono', Menlo, Consolas, monospace"

function rgbStr(rgb: Rgb): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function rgbaStr(rgb: Rgb, alpha: number): string {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
}

/**
 * 主题样式表（inline style），与源引擎 build_styles() 逐项对齐。
 *
 * Why: 微信编辑器剥离 <style> 与 class，只有 inline style 能存活；
 *      版心几何采用「盒缘与正文平齐」——容器 padding 8px 是装饰线，正文层（p/列表/表格/
 *      分隔线/图片）margin-left 为 0 直接贴线，标题/引用/Callout/代码块等装饰盒左缘同贴
 *      装饰线（通栏悬挂），盒内文字统一再缩 8px，全文文字左缘完全对齐。
 * Edge: 全部色值由主色 rgb 三元组推导，换色零散落修改；文字背景与分隔线严禁渐变
 *      （纯色微染底，保证移动端可读性与对比度）。
 */
export function buildWechatStyles(accent: Rgb) {
  const A = rgbStr(accent)
  return {
    section: `max-width:677px;margin:0 auto;padding:8px;background-color:rgb(255,253,255);border-radius:12px;color:rgb(34,34,34);line-height:1.75;font-size:15px;font-family:${FONT};`,
    // 主标题：左侧强调实线竖条，无底线（复制到公众号时会自动剥离，后台有独立标题区）
    h1: `font-size:21px;font-weight:600;color:${A};margin:0 0 0.75em 0px;line-height:1.4em;word-break:break-all;padding:2px 0 2px 4px;letter-spacing:0.5px;border-left:4px solid ${A};font-family:${FONT};`,
    // 章节标题：微染浅底色块条 + 左实线竖边（背景通栏悬挂，盒内文字统一再缩 8px）
    h2: `margin:2.2em 0px 0.8em;padding:7px 12px 7px 4.5px;background:${rgbaStr(accent, 0.04)};border-left:3.5px solid ${A};border-radius:4px 10px 10px 4px;font-size:18px;font-weight:600;line-height:1.4;color:${A};font-family:${FONT};`,
    // 子标题：左侧细实线竖条，文字加粗深灰
    h3: `margin:1.6em 0px 0.5em;padding:1px 0 1px 5.5px;border-left:2.5px solid ${A};font-size:16.5px;font-weight:600;line-height:1.4;color:rgb(63,63,63);font-family:${FONT};`,
    // 正文（左 margin 0：文字贴装饰线，与标题盒左缘平齐）
    p: `margin:1.2em 8px 1.2em 0px;text-align:justify;line-height:1.75;font-size:15px;letter-spacing:0.1em;color:rgb(34,34,34);overflow-wrap:break-word;font-family:${FONT};`,
    strong: `font-weight:bold;color:${A};font-family:${FONT};`,
    em: `font-style:italic;color:rgb(102,102,102);font-family:${FONT};`,
    // 引用块（Callout 便签框）：无边框纯底色卡片，微弱底色 + 8px 圆角，与 H2 色块彻底解耦
    blockquote: `margin:1.6em 0 1.8em;padding:12px 14px 12px 8px;font-size:14px;color:rgb(63,63,63);background:${rgbaStr(accent, 0.02)};border-radius:8px;line-height:1.75;font-family:${FONT};`,
    // 引用块内 p：覆盖正文样式（左对齐，深灰字）
    bq_p: `margin:0;text-align:left;line-height:1.75;font-size:1em;display:block;color:rgb(63,63,63);font-family:${FONT};`,
    // 分隔线：纯色细线（避免渐变渲染异常）
    hr: `border:none;border-top:1px solid ${rgbaStr(accent, 0.2)};height:0px;margin:2em 8px 2em 0px;`,
    // 列表：list-style 必须为 none，否则原生 marker 与手写符号叠加成双圆点
    ul: `list-style:none;margin:0em 8px 1.5em 0px;padding:0px;text-align:left;line-height:1.75;font-size:14px;color:rgb(63,63,63);font-family:${FONT};`,
    ol: `list-style:none;margin:0em 8px 1.5em 0px;padding:0px;text-align:left;line-height:1.75;font-size:14px;color:rgb(63,63,63);font-family:${FONT};`,
    li: `list-style:none;margin:0.5em 0px;padding:0px;text-align:left;line-height:1.75;font-size:14px;color:rgb(63,63,63);font-family:${FONT};`,
    // 链接上标序号：正文不渲染 <a>（微信正文外链不可点），锚文本 + 上标，URL 进文末参考链接卡
    fn_sup: `font-size:0.72em;color:${A};font-weight:600;font-family:${FONT};`,
    code: `background:${rgbaStr(accent, 0.1)};color:${A};padding:2px 6px;border-radius:3px;font-size:0.9em;font-family:${MONO};`,
    // 代码块外层 pre（滚动容器 + 视觉盒）：配方照抄 doocs/md 默认主题（微信海量验证）——
    // overflow-x:auto 滚动挂外层，padding:0 !important 防微信主题覆盖，内层承载 padding
    pre: `background:rgb(250,250,250);border-left:3px solid ${rgbaStr(accent, 0.5)};border-radius:6px;margin:1.4em 0;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:0 !important;font-size:12px;line-height:1.55;box-shadow:rgba(0,0,0,0.03) 0px 2px 4px;`,
    // 代码块内层 code：display:-webkit-box 让元素自身宽度收缩为内容宽（不靠溢出撑滚动，
    // 微信 WebView 中最稳）；white-space:nowrap 只防软折行——换行由 <br/> 承担、空格由
    // &nbsp; 承担（见 highlight 阶段转换），tab 转 4 空格，三者都不依赖 white-space:pre
    pre_code: `display:-webkit-box;white-space:nowrap;overflow-x:auto;text-indent:0;margin:0;padding:14px 16px 14px 5px;background:none;color:rgb(63,63,63);font-family:${MONO};font-size:12px;line-height:1.55;`,
    img: 'max-width:100%;border-radius:6px;margin:1.2em 8px 1.2em 0px;display:block;',
    // 表格：表头主色底，单元格无背景
    table: `width:100%;border-collapse:collapse;margin:1.2em 8px 1.2em 0px;font-size:14px;font-family:${FONT};`,
    th: `border-bottom:2px solid ${A};padding:10px 12px;text-align:left;color:rgb(63,63,63);font-weight:bold;font-family:${FONT};background:${rgbaStr(accent, 0.08)};`,
    td: `border-bottom:1px solid rgb(229,229,229);padding:10px 12px;color:rgb(34,34,34);font-family:${FONT};`,
  }
}

type WechatStyles = ReturnType<typeof buildWechatStyles>

// 列表层级 → 项目符号（用文本符号，微信兼容性最好）
const BULLETS = ['• ', '◦ ', '▪ ']

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// 单次转换的上下文：样式表 + 主色 + 参考链接注册表（同 URL 去重复用编号）
interface ConvertContext {
  styles: WechatStyles
  accent: Rgb
  linkRefs: { url: string; text: string }[]
}

function registerLink(ctx: ConvertContext, url: string, text: string): number {
  const idx = ctx.linkRefs.findIndex((r) => r.url === url)
  if (idx >= 0) return idx + 1
  ctx.linkRefs.push({ url, text })
  return ctx.linkRefs.length
}

/**
 * Markdown 行内文本 → 带 inline style 的 HTML。
 *
 * How: 行内代码必须最先抽出占位（保护内容不被 * 等误解析）→ HTML 转义 → 链接/加粗/斜体 → 还原代码。
 * Edge: 链接不渲染 <a>（微信正文外链不可点）：锚文本 + 主色上标序号，URL 进文末「参考链接」卡。
 */
function parseInline(text: string, ctx: ConvertContext): string {
  const codeStore: string[] = []

  // 1. 抽出行内代码（保护内容）
  let s = text.replace(/`([^`]+)`/g, (_, code: string) => {
    codeStore.push(escapeHtml(code))
    return `\x00CODE${codeStore.length - 1}\x00`
  })

  // 2. HTML 转义剩余文本（链接注册表里存的也是转义后文本，参考卡直接输出）
  s = escapeHtml(s)

  // 3. 链接 / 加粗 / 斜体
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, url: string) => {
    const n = registerLink(ctx, url, label)
    return `${label}<sup style="${ctx.styles.fn_sup}">[${n}]</sup>`
  })
  s = s.replace(/\*\*([^*]+)\*\*/g, (_, bold: string) => {
    return `<strong style="${ctx.styles.strong}">${bold}</strong>`
  })
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, (_, it: string) => {
    return `<em style="${ctx.styles.em}">${it}</em>`
  })

  // 4. 还原行内代码
  s = s.replace(/\x00CODE(\d+)\x00/g, (_, idx: string) => {
    return `<code style="${ctx.styles.code}">${codeStore[Number(idx)]}</code>`
  })

  return s
}

/**
 * 渲染微信原生高兼容流式步骤卡片组。
 *
 * Why: 架构与流程图严禁 ASCII 字符画（移动端必散架）；改为无边框纯净面性设计——
 *      柔和微染大底盒 + 白底悬浮分层卡片 + 浅色标题条 + 中文「执行流程」指示，
 *      彻底解决与 H2 标题的视觉重合，零横滑、100% 移动端自适应。
 * Edge: 兼容 (流向注解) 箭头行、[标题] 描述、**标题**：描述、中英文冒号步骤，以及 [标题 | 标签] 右侧浮动标签。
 */
function renderFlowBlock(lines: string[], ctx: ConvertContext): string {
  const { accent } = ctx
  const A = rgbStr(accent)
  const bgTint = rgbaStr(accent, 0.04)
  const headerTint = rgbaStr(accent, 0.08)
  const cards: string[] = []

  for (const raw of lines) {
    const ln = raw.trim()
    if (!ln) continue

    // 1. 连接箭头行：以 ↓ ▼ -> ➔ │ └ ├ 开头，或整行被括号包裹的注解
    const isArrow =
      ['↓', '▼', '->', '➔', '│', '└', '├'].some((p) => ln.startsWith(p)) ||
      (ln.startsWith('(') && ln.endsWith(')'))
    if (isArrow) {
      const commentMatch = ln.match(/\((.*?)\)/)
      let commentText = commentMatch ? commentMatch[1] : ''
      // 无括号注解时，剥掉箭头/导线字符后的残余文本视作注解
      if (!commentText && ['↓', '▼', '➔', '->'].some((p) => ln.includes(p))) {
        const clean = ln.replace(/[↓▼➔\->| ─└├]+/g, '').trim()
        if (clean) commentText = clean
      }
      if (commentText) {
        cards.push(
          `<section style="text-align:center;color:${A};font-size:13px;line-height:1.2;margin:6px 0;font-weight:600;">` +
            `↓ <span style="font-size:11.5px;font-weight:normal;color:rgb(100,100,100);` +
            `background-color:#ffffff;padding:2px 8px;border-radius:10px;` +
            `box-shadow:0 1px 2px rgba(0,0,0,0.03);margin-left:4px;display:inline-block;">` +
            `${escapeHtml(commentText)}</span></section>`
        )
      } else {
        cards.push(
          `<section style="text-align:center;color:${A};font-size:13px;line-height:1.2;margin:6px 0;font-weight:600;">↓</section>`
        )
      }
      continue
    }

    // 2. 步骤卡片行：格式 "[标题] 描述" 或 "**标题**：描述" 或 "标题: 描述"
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
      const sepIdx = ln.indexOf(sep)
      cTitle = ln.slice(0, sepIdx).trim()
      cDesc = ln.slice(sepIdx + sep.length).trim()
    }

    // 3. 标题内 "|" 拆出右侧浮动标签：[标题 | 标签]
    let tagHtml = ''
    const barIdx = cTitle.indexOf('|')
    if (barIdx >= 0) {
      const cTag = cTitle.slice(barIdx + 1).trim()
      cTitle = cTitle.slice(0, barIdx).trim()
      tagHtml =
        `<span style="font-size:11px;font-weight:normal;color:${A};opacity:0.85;` +
        `background-color:#ffffff;padding:1px 6px;border-radius:4px;` +
        `box-shadow:0 1px 2px rgba(0,0,0,0.02);float:right;">${escapeHtml(cTag)}</span>`
    }

    const titleParsed = parseInline(cTitle, ctx)
    const descParsed = cDesc ? parseInline(cDesc, ctx) : ''
    const titleInner = tagHtml ? `<span>${titleParsed}</span>${tagHtml}` : titleParsed
    const descBlock = descParsed
      ? `<section style="padding:10px 12px;font-size:13.5px;color:rgb(70,70,70);line-height:1.65;` +
        `background-color:#ffffff;border-radius:0 0 8px 8px;text-align:left;font-family:${FONT};box-sizing:border-box;">` +
        `${descParsed}</section>`
      : ''
    cards.push(
      `<section style="border-radius:8px;overflow:hidden;margin:8px 0;box-sizing:border-box;background-color:#ffffff;box-shadow:0 1px 3px rgba(0,0,0,0.04);">` +
        `<section style="background-color:${headerTint};padding:8px 12px;border-radius:8px 8px 0 0;font-family:${FONT};box-sizing:border-box;">` +
        `<section style="font-size:13.5px;font-weight:bold;color:${A};line-height:1.4;text-align:left;">${titleInner}</section>` +
        `</section>${descBlock}</section>`
    )
  }

  // 大底盒 + 中文「执行流程」指示（0.5 透明度圆点），内部承载分层卡片
  return (
    `<section style="margin:1.6em 0;padding:14px 14px;background-color:${bgTint};border-radius:12px;box-sizing:border-box;">` +
    `<section style="font-size:13px;font-weight:bold;color:${rgbaStr(accent, 0.5)};margin-bottom:12px;` +
    `letter-spacing:0.5px;font-family:${FONT};line-height:1.4;">` +
    `<span style="color:${rgbaStr(accent, 0.5)};font-size:12px;margin-right:6px;display:inline-block;">●</span>执行流程</section>` +
    `${cards.join('')}</section>`
  )
}

// 类型化 Callout：主色单色系，仅以底色浓度区分类型，图标 + 默认标签
const CALLOUT_TYPES: Record<string, [string, string, number]> = {
  tip: ['💡', '提示', 0.05],
  warn: ['⚠️', '注意', 0.08],
  note: ['📌', '说明', 0.02],
}
// 引用块首行类型标记 → 标准类型名（GFM alert 别名归一）
const CALLOUT_ALIASES: Record<string, string> = { warning: 'warn', info: 'note' }
const CALLOUT_RE = /^\[!(tip|warn|warning|note|info)\]\s*(.*)$/i

/** 类型化 Callout 卡：与普通引用同骨架（无边框纯底色 + 圆角），底色浓度随类型加深。 */
function renderCallout(kind: string, customTitle: string, bodyHtml: string, ctx: ConvertContext): string {
  const [icon, label, tint] = CALLOUT_TYPES[kind] ?? CALLOUT_TYPES.note
  const A = rgbStr(ctx.accent)
  const title = customTitle || label
  const titleHtml =
    `<section style="font-weight:bold;color:${A};font-size:14px;line-height:1.5;margin-bottom:4px;` +
    `text-align:left;font-family:${FONT};">${icon} ${parseInline(title, ctx)}</section>`
  return (
    `<section style="margin:1.6em 0 1.8em;padding:12px 14px 12px 8px;font-size:14px;` +
    `color:rgb(63,63,63);background:${rgbaStr(ctx.accent, tint)};` +
    `border-radius:8px;line-height:1.75;font-family:${FONT};">${titleHtml}${bodyHtml}</section>`
  )
}

/** 文末「参考链接」卡：承载正文所有上标序号对应的 URL，读者可长按复制。 */
function renderRefsCard(ctx: ConvertContext): string {
  if (ctx.linkRefs.length === 0) return ''
  const A = rgbStr(ctx.accent)
  const items = ctx.linkRefs
    .map(
      (r, idx) =>
        `<section style="margin:7px 0;font-size:13px;line-height:1.6;color:rgb(63,63,63);` +
        `text-align:left;font-family:${FONT};">` +
        `<span style="color:${A};font-weight:600;">[${idx + 1}]</span> ${r.text}：` +
        `<span style="color:${A};word-break:break-all;overflow-wrap:break-word;">${r.url}</span>` +
        `</section>`
    )
    .join('')
  return (
    `<section style="margin:2.2em 0 0.5em;padding:12px 14px 12px 8px;` +
    `background:${rgbaStr(ctx.accent, 0.02)};border-radius:8px;box-sizing:border-box;">` +
    `<section style="font-weight:bold;color:${A};font-size:14px;margin-bottom:4px;` +
    `line-height:1.5;font-family:${FONT};">🔗 参考链接</section>${items}</section>`
  )
}

// ============================================================
// 轻量语法高亮（正则级，零依赖）：注释/字符串/关键字/数字 四类
// 配色遵循主题单色系：主色（关键字加粗/字符串常规）+ 灰阶（注释斜体/数字加粗）
// 只登记常见语言，未登记语言保持纯色转义，避免正则误伤
// ============================================================
function hlLang(name: string): string {
  const alias: Record<string, string> = {
    py: 'python',
    python3: 'python',
    js: 'javascript',
    node: 'javascript',
    ts: 'javascript',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    console: 'bash',
  }
  return alias[name] ?? name
}

const HL_KEYWORDS: Record<string, Set<string>> = {
  python: new Set(
    ('def class import from return if elif else for while in not and or None True ' +
      'False with as try except finally raise lambda pass break continue yield global ' +
      'nonlocal assert del is async await self').split(' ')
  ),
  javascript: new Set(
    ('function const let var return if else for while class new import export ' +
      'from default async await try catch finally throw typeof instanceof of in ' +
      'switch case break continue null undefined true false this extends static ' +
      'yield delete void interface type enum implements').split(' ')
  ),
  json: new Set(['true', 'false', 'null']),
  bash: new Set(
    ('if then else elif fi for while until do done case esac function return in select ' +
      'time export local readonly source alias').split(' ')
  ),
}

// 行注释：python/bash 用 #，js 系另有 /* */ 块注释；json 无注释
const HL_COMMENTS: Record<string, string[]> = {
  python: ['#[^\\n]*'],
  bash: ['#[^\\n]*'],
  javascript: ['//[^\\n]*', '/\\*[\\s\\S]*?\\*/'],
  json: [],
}

// 字符串模式（长在前，防三引号被空串截断）：三引号仅 python，反引号模板串仅 js，json 只认双引号
const _SQ = /'(?:\\.|[^'\\\n])*'/.source
const _DQ = /"(?:\\.|[^"\\\n])*"/.source
const HL_STRINGS: Record<string, string[]> = {
  python: ['"""[\\s\\S]*?"""', "'''[\\s\\S]*?'''", _DQ, _SQ],
  javascript: [_DQ, _SQ, '`(?:\\\\.|[^`\\\\])*`'],
  json: [_DQ],
  bash: [_DQ, _SQ],
}

// token 正则按语言组装；交替顺序即优先级：注释 → 字符串 → 数字 → 标识符
const HL_TOKEN_RE: Record<string, RegExp> = Object.fromEntries(
  Object.keys(HL_COMMENTS).map((lang) => [
    lang,
    new RegExp(
      [
        ...HL_COMMENTS[lang].map((p, k) => `(?<c${k}>${p})`),
        ...HL_STRINGS[lang].map((p, k) => `(?<s${k}>${p})`),
        '(?<num>\\b(?:0[xX][0-9a-fA-F]+|\\d+(?:\\.\\d+)?)\\b)',
        '(?<id>[A-Za-z_$][\\w$]*)',
      ].join('|'),
      'g'
    ),
  ])
)

/**
 * 代码文本出口：tab 转 4 空格、空格转 &nbsp;。
 * Why: 微信编辑器会折叠普通空格序列，转义成不可断空格后，
 *      缩进与列对齐在任何清洗级别下都不塌陷（裸 \n 与空格是粘贴后折行错乱的根源）。
 */
function wxText(s: string): string {
  return escapeHtml(s.replace(/\t/g, '    ')).replace(/ /g, '&nbsp;')
}

/** 代码 → 四类 inline style 着色 span 的 HTML；未登记语言整段纯色转义。 */
function highlightCode(code: string, langRaw: string, accent: Rgb): string {
  const lang = hlLang(langRaw)
  const kwset = HL_KEYWORDS[lang]
  const tokenRe = HL_TOKEN_RE[lang]
  if (!kwset || !tokenRe) return wxText(code)
  const A = rgbStr(accent)
  const styles = {
    comment: 'color:rgb(150,150,150);font-style:italic;',
    string: `color:${A};`,
    kw: `color:${A};font-weight:600;`,
    num: 'color:rgb(63,63,63);font-weight:600;',
  }
  const out: string[] = []
  let pos = 0
  for (const m of code.matchAll(tokenRe)) {
    const start = m.index ?? 0
    out.push(wxText(code.slice(pos, start)))
    const text = m[0]
    // JS 无 Python 的 lastgroup：命中的命名分组即值非 undefined 的那个
    const kind = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0] ?? ''
    if (kind === 'id') {
      // 标识符仅命中关键字时着色，其余原样
      if (kwset.has(text)) out.push(`<span style="${styles.kw}">${wxText(text)}</span>`)
      else out.push(wxText(text))
    } else if (kind === 'num') {
      out.push(`<span style="${styles.num}">${wxText(text)}</span>`)
    } else if (kind[0] === 'c' || kind[0] === 's') {
      const key = kind[0] === 'c' ? 'comment' : 'string'
      out.push(`<span style="${styles[key]}">${wxText(text)}</span>`)
    }
    pos = start + text.length
  }
  out.push(wxText(code.slice(pos)))
  return out.join('')
}

/**
 * 将输入的 Markdown 转换成完整的微信公众号 Section HTML 片段（逐行状态机）。
 * Why: 输出为正文片段而非整页文档——由调用方决定预览容器或写入富文本剪贴板。
 */
export function convertMarkdownToWechat(mdText: string, theme: ThemePreset = 'sage'): string {
  const accent = THEME_PRESETS[theme].rgb
  const styles = buildWechatStyles(accent)
  const ctx: ConvertContext = { styles, accent, linkRefs: [] }
  const lines = mdText.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let i = 0
  const n = lines.length

  let paraBuf: string[] = []
  function flushPara() {
    if (paraBuf.length > 0) {
      out.push(`<p style="${styles.p}">${parseInline(paraBuf.join(' '), ctx)}</p>`)
      paraBuf = []
    }
  }

  while (i < n) {
    const line = lines[i]

    // --- 空行：段落边界 ---
    if (line.trim() === '') {
      flushPara()
      i++
      continue
    }

    // --- 代码块 / 流式步骤卡片 ``` ---
    const fenceM = line.match(/^(```|~~~)(.*)$/)
    if (fenceM) {
      flushPara()
      const info = fenceM[2].trim().toLowerCase()
      const codeLines: string[] = []
      i++
      while (i < n && !lines[i].match(/^(```|~~~)/)) {
        codeLines.push(lines[i])
        i++
      }
      i++ // 跳过结束 ```

      if (['flow', 'steps', 'cards', 'workflow'].includes(info)) {
        out.push(renderFlowBlock(codeLines, ctx))
      } else {
        // 语言取 info 首词（容忍 "python title=x" 等附加参数）；未登记语言纯色。
        // 换行转 <br/>、空格/tab 已在 highlight 阶段转 &nbsp;（4 空格），不依赖 white-space:pre
        const lang = info ? info.split(/\s+/)[0] : ''
        const codeHtml = highlightCode(codeLines.join('\n'), lang, accent).replace(/\n/g, '<br/>')
        out.push(`<pre style="${styles.pre}"><code style="${styles.pre_code}">${codeHtml}</code></pre>`)
      }
      continue
    }

    // --- ATX 标题 #（h4+ 退化为 h3，避免层级过深导致版式碎片化） ---
    const atxM = line.match(/^(#{1,6})\s+(.*)$/)
    if (atxM) {
      flushPara()
      const level = Math.min(atxM[1].length, 3)
      const hText = parseInline(atxM[2].trim(), ctx)
      const hStyle = level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3
      out.push(`<h${level} style="${hStyle}">${hText}</h${level}>`)
      i++
      continue
    }

    // --- 分隔线 ---
    if (line.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
      flushPara()
      out.push(`<hr style="${styles.hr}"></hr>`)
      i++
      continue
    }

    // --- 引用块 >（首行 [!tip]/[!warn]/[!note] 触发类型化 Callout，兼容 [!warning]/[!info] 别名） ---
    if (line.trimStart().startsWith('>')) {
      flushPara()
      const bqLines: string[] = []
      while (i < n && lines[i].trimStart().startsWith('>')) {
        bqLines.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      // 首行类型标记 + 可选自定义标题，命中则从正文行中剔除
      let callout: { kind: string; title: string } | null = null
      const cm = (bqLines[0] ?? '').trim().match(CALLOUT_RE)
      if (cm) {
        const raw = cm[1].toLowerCase()
        callout = { kind: CALLOUT_ALIASES[raw] ?? raw, title: cm[2].trim() }
        bqLines.shift()
      }
      // 引用内的多段
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
        .map((p) => `<p style="${styles.bq_p}">${parseInline(p, ctx)}</p>`)
        .join('')
      out.push(
        callout
          ? renderCallout(callout.kind, callout.title, inner, ctx)
          : `<blockquote style="${styles.blockquote}">${inner}</blockquote>`
      )
      continue
    }

    // --- 列表（无序/有序） ---
    const ulM = line.match(/^(\s*)[-*+]\s+(.*)$/)
    const olM = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
    if (ulM || olM) {
      flushPara()
      const isUl = Boolean(ulM)
      const items: { indent: number; text: string }[] = []
      while (i < n) {
        const ln = lines[i]
        if (ln.trim() === '') {
          // 空行：下一行仍是列表项则视作列表内软换行，否则列表结束
          if (
            i + 1 < n &&
            (lines[i + 1].match(/^(\s*)[-*+]\s+/) || lines[i + 1].match(/^(\s*)\d+\.\s+/))
          ) {
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
      // 渲染：按缩进算层级深度，最小缩进做基准
      const baseIndent = items.reduce((min, it) => Math.min(min, it.indent), 0)
      const liHtmls = items.map((it, idx) => {
        const depth = Math.max(0, Math.floor((it.indent - baseIndent) / 2))
        const prefix = isUl ? BULLETS[Math.min(depth, BULLETS.length - 1)] : `${idx + 1}. `
        return `<li style="${styles.li}">${prefix}${parseInline(it.text, ctx)}</li>`
      })
      const listTag = isUl ? 'ul' : 'ol'
      const listStyle = isUl ? styles.ul : styles.ol
      out.push(`<${listTag} style="${listStyle}">${liHtmls.join('')}</${listTag}>`)
      continue
    }

    // --- 表格（简单 GFM：| a | b | + 分隔行） ---
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
        const body = rows.slice(2) // rows[1] 是分隔行
        const thead = `<tr>${header.map((c) => `<th style="${styles.th}">${parseInline(c, ctx)}</th>`).join('')}</tr>`
        const tbody = body
          .map((r) => `<tr>${r.map((c) => `<td style="${styles.td}">${parseInline(c, ctx)}</td>`).join('')}</tr>`)
          .join('')
        out.push(`<table style="${styles.table}"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`)
      }
      continue
    }

    // --- 图片 ![alt](url) 独占一行 ---
    const imgM = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (imgM) {
      flushPara()
      // 协议安全校验：拦截 javascript: 等伪协议注入（浏览器环境必需）
      const srcUrl = imgM[2].trim()
      const isSafe = /^(https?:\/\/|data:image\/|\/)/i.test(srcUrl)
      if (isSafe) {
        out.push(
          `<img src="${escapeHtml(srcUrl)}" alt="${escapeHtml(imgM[1])}" style="${styles.img}">`
        )
      }
      i++
      continue
    }

    // --- 普通段落行 ---
    paraBuf.push(line.trim())
    i++
  }

  flushPara()
  // 文末参考链接卡（正文存在外链时自动生成）
  out.push(renderRefsCard(ctx))

  return `<section style="${styles.section}">${out.join('\n')}</section>`
}
