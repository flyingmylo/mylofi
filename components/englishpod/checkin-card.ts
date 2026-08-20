/**
 * 打卡分享卡（1080×1080 PNG）：纯 canvas 绘制，编辑排版风格。
 * 配色取站点浅色主题常量（分享图固定浅色纸底，不跟随站点深色模式）。
 */

export type CheckinEpisode = { no: number; title: string }

const W = 1080
const H = 1080
const M = 72 // 卡片外边距（边框位置）
const PAD = 56 // 边框内文字内边距
const X0 = M + PAD
const X1 = W - M - PAD
const CW = X1 - X0

const C = {
  paper: '#fffdff',
  ink: '#403a32',
  muted: '#a69c8b',
  accent: '#5f7355',
  line: '#eae3d3',
}

const SERIF = 'Georgia, "Times New Roman", "Songti SC", STSong, SimSun, serif'

function monoStack(): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-geist-mono')
    .trim()
  return v || 'ui-monospace, Menlo, monospace'
}

function dateLabel(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, v: string) {
  // Chrome 99+ / Safari 17+ 支持，不支持时静默跳过
  try {
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = v
  } catch {
    /* noop */
  }
}

function hairline(ctx: CanvasRenderingContext2D, y: number) {
  ctx.fillStyle = C.line
  ctx.fillRect(X0, y, CW, 2)
}

function fillRounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, h / 2)
    ctx.fill()
  } else {
    ctx.fillRect(x, y, w, h)
  }
}

function ellipsis(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1)
  }
  return `${t}…`
}

export async function renderCheckinCard(episodes: CheckinEpisode[]): Promise<Blob> {
  await document.fonts.ready
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')
  const mono = monoStack()

  // 纸底 + 内嵌发丝线卡片框
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = C.line
  ctx.lineWidth = 2
  ctx.strokeRect(M, M, W - M * 2, H - M * 2)

  // ===== 头部：ENGLISHPOD · 打卡 ｜ 日期 =====
  const headY = M + PAD + 34
  ctx.fillStyle = C.muted
  ctx.font = `500 26px ${mono}`
  ctx.textBaseline = 'alphabetic'
  setLetterSpacing(ctx, '3px')
  ctx.textAlign = 'left'
  ctx.fillText('ENGLISHPOD · 打卡', X0, headY)
  ctx.textAlign = 'right'
  ctx.fillText(dateLabel(), X1, headY)
  setLetterSpacing(ctx, '0px')
  hairline(ctx, headY + 28)

  // ===== 计数：今日打卡 ｜ N 期 =====
  const cntY = headY + 178
  ctx.textAlign = 'left'
  ctx.fillStyle = C.ink
  ctx.font = `600 34px ${SERIF}`
  ctx.fillText('今日打卡', X0, cntY)
  ctx.font = `600 92px ${SERIF}`
  const nStr = String(episodes.length)
  const nW = ctx.measureText(nStr).width
  ctx.font = `34px ${SERIF}`
  const qiW = ctx.measureText('期').width
  const nX = X1 - nW - 18 - qiW
  ctx.font = `600 92px ${SERIF}`
  ctx.fillStyle = C.accent
  ctx.fillText(nStr, nX, cntY)
  ctx.font = `34px ${SERIF}`
  ctx.fillStyle = C.muted
  ctx.fillText('期', nX + nW + 18, cntY)

  // ===== 底部：进度条（最大期号 / 365）+ 署名 =====
  const footY = H - M - PAD - 90
  hairline(ctx, footY)
  const maxNo = Math.max(...episodes.map((e) => e.no))
  const barY = footY + 48
  const barH = 10
  ctx.fillStyle = C.line
  fillRounded(ctx, X0, barY, CW, barH)
  ctx.fillStyle = C.accent
  fillRounded(ctx, X0, barY, (CW * maxNo) / 365, barH)
  const labY = barY + barH + 54
  ctx.font = `500 28px ${mono}`
  ctx.textAlign = 'left'
  ctx.fillStyle = C.ink
  ctx.fillText(`${maxNo} / 365`, X0, labY)

  // ===== 期次列表（自适应行高 + 垂直居中；输入上限 3 期，截断仅作兜底） =====
  const MAX_ROWS = 3
  const rows = episodes.slice(0, MAX_ROWS)
  const extra = episodes.length - rows.length
  const listTop = cntY + 84
  const listBottom = footY - 64
  const available = listBottom - listTop
  const rowH = Math.min(
    160,
    Math.max(84, available / Math.max(rows.length + (extra > 0 ? 1 : 0), 1)),
  )
  const blockH = rowH * (rows.length + (extra > 0 ? 1 : 0))
  let y = listTop + Math.max(0, (available - blockH) / 2) + rowH * 0.72
  for (let i = 0; i < rows.length; i++) {
    ctx.font = `500 30px ${mono}`
    ctx.textAlign = 'left'
    ctx.fillStyle = C.muted
    ctx.fillText(String(rows[i].no).padStart(4, '0'), X0, y)
    ctx.font = `600 44px ${SERIF}`
    ctx.fillStyle = C.ink
    const tx = X0 + 150
    ctx.fillText(ellipsis(ctx, rows[i].title, X1 - tx), tx, y)
    if (i < rows.length - 1 || extra > 0) hairline(ctx, y + rowH * 0.34)
    y += rowH
  }
  if (extra > 0) {
    ctx.font = `500 30px ${mono}`
    ctx.textAlign = 'left'
    ctx.fillStyle = C.muted
    ctx.fillText(`+${extra} 期`, X0 + 150, y)
  }

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas toBlob failed'))),
      'image/png',
    ),
  )
}
