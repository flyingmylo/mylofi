/**
 * wechat-kit: 微信公众号 2.35:1 矢量封面生成器与高清导出器
 * 
 * 核心规范：
 * 1. 标准画布尺寸 900 × 383，导出默认 2 倍（1800 × 766 Retina 高清无损）；
 * 2. 严格防遮挡规范：左侧文字区宽 420px，右侧场景区 x∈[460, 880]，底部 25% 预留微信信息流标题遮罩区；
 * 3. 机制具象化：内置注意力热力矩阵、因果掩码三角网格、Logits采样柱、三面分色等距堆叠塔。
 */

export type CoverStyle = 'flat' | 'blueprint' | 'iso' | 'midnight' | 'darkgold'
export type CoverTheme = 'navy' | 'sage'

export const COVER_STYLES: { id: CoverStyle; name: string; desc: string }[] = [
  { id: 'flat', name: '极简扁平', desc: 'QKV 矩阵映射与 Attention 热力格加权' },
  { id: 'blueprint', name: '蓝图线稿', desc: 'Decoder-Only 因果掩码与自回归接龙闭环' },
  { id: 'iso', name: '等距 2.5D', desc: '四层模型参数堆叠塔与智能体外挂能力卫星' },
  { id: 'midnight', name: '深邃暗蓝', desc: '重大发布/突破专属深底反差色（暗蓝 + 亮电青）' },
  { id: 'darkgold', name: '暗色金线', desc: '黑金高级感深底与唯一光晕焦点' },
]

export const COVER_THEMES: Record<CoverTheme, { name: string; accent: string; bg: string; text: string; mid: string; light: string; faint: string }> = {
  navy: {
    name: '稳重藏青',
    accent: '#2b5c8f',
    bg: '#f4f7fb', // 冰蓝微冷淡灰底
    text: '#111827',
    mid: '#416bc0',
    light: '#b9cdf7',
    faint: '#e9effa',
  },
  sage: {
    name: '典雅灰绿',
    accent: '#5f7355',
    bg: '#fdfcf9', // 象牙纸质暖底
    text: '#222222',
    mid: '#8a9a80',
    light: '#c9d2c3',
    faint: '#f0f3ed',
  },
}

export type CoverOptions = {
  titleLine1: string
  titleLine2?: string
  eyebrow: string
  subtitle: string
  style: CoverStyle
  theme: CoverTheme
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function generateCoverSvg({
  titleLine1,
  titleLine2,
  eyebrow,
  subtitle,
  style,
  theme,
}: CoverOptions): string {
  const isDark = style === 'darkgold' || style === 'midnight'
  const t = COVER_THEMES[theme]

  // 色板角色分配
  const p = isDark
    ? style === 'midnight'
      ? {
          BG: '#0b1120',
          TEXT: '#f8fafc',
          PRIMARY: '#38bdf8',
          MID: '#3b82f6',
          LIGHT: '#1e293b',
          FAINT: '#131c31',
          DEEP: '#f8fafc',
          FILL: '#0b1120',
        }
      : {
          BG: '#1c1f1a',
          TEXT: '#f2eee3',
          PRIMARY: '#d4af6a',
          MID: '#a8894f',
          LIGHT: '#6b5a35',
          FAINT: '#262a22',
          DEEP: '#f2eee3',
          FILL: '#1c1f1a',
        }
    : {
        BG: t.bg,
        TEXT: t.text,
        PRIMARY: t.accent,
        MID: t.mid,
        LIGHT: t.light,
        FAINT: t.faint,
        DEEP: '#111827',
        FILL: style === 'blueprint' ? 'none' : '#ffffff',
      }

  const W = 900
  const H = 383
  const FONT = "'PingFang SC', 'Helvetica Neue', sans-serif"

  // 1. Defs
  const defs = `
  <defs>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="${p.MID}"/>
    </marker>
    <marker id="arrowStrong" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="8.5" markerHeight="8.5" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="${p.PRIMARY}"/>
    </marker>
  </defs>`

  // 2. 左侧文字骨架
  const hasTwo = Boolean(titleLine2 && titleLine2.trim() !== '')
  const titleSize = 42
  let skeleton = `
    <!-- 眉题 -->
    <text x="56" y="96" font-family="${FONT}" font-size="13" fill="${p.MID}" font-weight="500" letter-spacing="3">${esc(eyebrow)}</text>
    <!-- 主标题第一行 -->
    <text x="54" y="140" font-family="${FONT}" font-size="${titleSize}" fill="${p.TEXT}" font-weight="600" letter-spacing="2">${esc(titleLine1)}</text>
  `
  let divY = 176
  if (hasTwo) {
    skeleton += `
      <!-- 主标题第二行 -->
      <text x="54" y="190" font-family="${FONT}" font-size="${titleSize}" fill="${p.TEXT}" font-weight="600" letter-spacing="2">${esc(titleLine2!)}</text>
    `
    divY = 214
  }
  skeleton += `
    <!-- 分隔条 -->
    <rect x="56" y="${divY}" width="60" height="4" rx="2" fill="${p.PRIMARY}"/>
    <!-- 副标题 -->
    <text x="56" y="${divY + 38}" font-family="${FONT}" font-size="17" fill="${p.PRIMARY}" font-weight="400">${esc(subtitle)}</text>
    <!-- 背景淡雅大圆修饰 -->
    <circle cx="${W - 30}" cy="-40" r="150" fill="${p.FAINT}"/>
    <circle cx="20" cy="${H + 30}" r="110" fill="${p.FAINT}"/>
  `

  // 3. 右侧场景几何根据风格生成
  let scene = ''
  if (style === 'flat') {
    // 扁平风：QKV 向量映射 + Attention 热力矩阵 + FFN + Token 发光
    scene = `
      <!-- Q, K, V 输入向量胶囊 -->
      <rect x="480" y="90" width="46" height="28" rx="6" fill="${p.PRIMARY}"/>
      <text x="503" y="109" font-family="${FONT}" font-size="14" fill="#ffffff" font-weight="600" text-anchor="middle">Q</text>
      
      <rect x="480" y="155" width="46" height="28" rx="6" fill="${p.MID}"/>
      <text x="503" y="174" font-family="${FONT}" font-size="14" fill="#ffffff" font-weight="600" text-anchor="middle">K</text>
      
      <rect x="480" y="225" width="46" height="28" rx="6" fill="${p.LIGHT}"/>
      <text x="503" y="244" font-family="${FONT}" font-size="14" fill="${p.DEEP}" font-weight="600" text-anchor="middle">V</text>

      <!-- 导线汇聚 -->
      <path d="M526,104 C550,104 555,120 575,125" fill="none" stroke="${p.MID}" stroke-width="2" stroke-dasharray="4 3"/>
      <path d="M526,169 C550,169 555,150 575,145" fill="none" stroke="${p.MID}" stroke-width="2" stroke-dasharray="4 3"/>

      <!-- Attention 权重热力矩阵 -->
      <rect x="580" y="85" width="115" height="115" rx="10" fill="${p.FILL}" stroke="${p.PRIMARY}" stroke-width="2.4"/>
      <text x="637" y="103" font-family="${FONT}" font-size="10" fill="${p.PRIMARY}" font-weight="600" letter-spacing="1" text-anchor="middle">ATTENTION</text>
      <rect x="593" y="113" width="25" height="20" rx="4" fill="${p.LIGHT}"/>
      <rect x="624" y="113" width="25" height="20" rx="4" fill="${p.MID}"/>
      <rect x="655" y="113" width="25" height="20" rx="4" fill="${p.PRIMARY}" filter="url(#glow)"/>
      <rect x="593" y="139" width="25" height="20" rx="4" fill="${p.MID}"/>
      <rect x="624" y="139" width="25" height="20" rx="4" fill="${p.LIGHT}"/>
      <rect x="655" y="139" width="25" height="20" rx="4" fill="${p.FAINT}"/>
      <rect x="593" y="165" width="25" height="20" rx="4" fill="${p.PRIMARY}"/>
      <rect x="624" y="165" width="25" height="20" rx="4" fill="${p.LIGHT}"/>
      <rect x="655" y="165" width="25" height="20" rx="4" fill="${p.MID}"/>

      <!-- FFN 投影 -->
      <path d="M526,239 C600,239 675,230 725,185" fill="none" stroke="${p.PRIMARY}" stroke-width="2.2" stroke-dasharray="5 4"/>
      <path d="M695,142 L725,155" fill="none" stroke="${p.PRIMARY}" stroke-width="2.2" stroke-dasharray="5 4"/>
      <rect x="725" y="130" width="55" height="70" rx="8" fill="${p.FILL}" stroke="${p.PRIMARY}" stroke-width="2.2"/>
      <text x="752" y="155" font-family="${FONT}" font-size="11" fill="${p.DEEP}" font-weight="600" text-anchor="middle">FFN</text>
      <line x1="735" y1="172" x2="770" y2="172" stroke="${p.LIGHT}" stroke-width="3" stroke-linecap="round"/>
      <line x1="735" y1="182" x2="760" y2="182" stroke="${p.LIGHT}" stroke-width="3" stroke-linecap="round"/>

      <!-- 输出 Token 发光 -->
      <line x1="780" y1="165" x2="818" y2="165" stroke="${p.PRIMARY}" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arrowStrong)"/>
      <rect x="818" y="142" width="46" height="46" rx="10" fill="${p.PRIMARY}" filter="url(#glow)"/>
      <text x="841" y="169" font-family="${FONT}" font-size="12" fill="#ffffff" font-weight="600" text-anchor="middle">Token</text>

      <!-- 核心公式徽章 -->
      <rect x="560" y="270" width="220" height="28" rx="14" fill="${p.FAINT}"/>
      <text x="670" y="288" font-family="${FONT}" font-size="11" fill="${p.PRIMARY}" font-weight="600" letter-spacing="1" text-anchor="middle">softmax(QKᵀ / √d) · V</text>
    `
  } else if (style === 'blueprint') {
    // 蓝图风：因果掩码 + Logits 采样柱 + 自回归闭环
    scene = `
      <!-- 四角标与虚线框 -->
      <rect x="475" y="45" width="395" height="290" fill="none" stroke="${p.MID}" stroke-width="1.2" stroke-dasharray="5 4"/>
      <path d="M475,59 L475,45 L489,45" fill="none" stroke="${p.PRIMARY}" stroke-width="2"/>
      <path d="M856,45 L870,45 L870,59" fill="none" stroke="${p.PRIMARY}" stroke-width="2"/>
      <path d="M475,321 L475,335 L489,335" fill="none" stroke="${p.PRIMARY}" stroke-width="2"/>
      <path d="M856,335 L870,335 L870,321" fill="none" stroke="${p.PRIMARY}" stroke-width="2"/>

      <!-- 顶部词元序列 -->
      <rect x="495" y="70" width="38" height="26" rx="4" fill="none" stroke="${p.PRIMARY}" stroke-width="1.8"/>
      <text x="514" y="88" font-family="${FONT}" font-size="12" fill="${p.DEEP}" font-weight="600" text-anchor="middle">t₁</text>
      <line x1="533" y1="83" x2="545" y2="83" stroke="${p.MID}" stroke-width="1.6"/>
      <rect x="545" y="70" width="38" height="26" rx="4" fill="none" stroke="${p.PRIMARY}" stroke-width="1.8"/>
      <text x="564" y="88" font-family="${FONT}" font-size="12" fill="${p.DEEP}" font-weight="600" text-anchor="middle">t₂</text>
      <line x1="583" y1="83" x2="595" y2="83" stroke="${p.MID}" stroke-width="1.6"/>
      <rect x="595" y="70" width="38" height="26" rx="4" fill="none" stroke="${p.PRIMARY}" stroke-width="1.8"/>
      <text x="614" y="88" font-family="${FONT}" font-size="12" fill="${p.DEEP}" font-weight="600" text-anchor="middle">t₃</text>
      <rect x="645" y="66" width="60" height="34" rx="5" fill="none" stroke="${p.PRIMARY}" stroke-width="2.2" stroke-dasharray="4 3"/>
      <text x="675" y="87" font-family="${FONT}" font-size="13" fill="${p.PRIMARY}" font-weight="600" text-anchor="middle">t₄ = ?</text>

      <!-- 因果掩码下三角 -->
      <rect x="495" y="125" width="155" height="120" rx="6" fill="none" stroke="${p.PRIMARY}" stroke-width="1.8"/>
      <text x="572" y="144" font-family="${FONT}" font-size="10" fill="${p.PRIMARY}" font-weight="600" letter-spacing="1" text-anchor="middle">CAUSAL MASK</text>
      <circle cx="525" cy="160" r="4" fill="${p.PRIMARY}"/>
      <path d="M546,157 L552,163 M552,157 L546,163" stroke="${p.MID}" stroke-width="1.4" opacity="0.5"/>
      <path d="M570,157 L576,163 M576,157 L570,163" stroke="${p.MID}" stroke-width="1.4" opacity="0.5"/>
      <path d="M594,157 L600,163 M600,157 L594,163" stroke="${p.MID}" stroke-width="1.4" opacity="0.5"/>
      <circle cx="525" cy="182" r="4" fill="${p.PRIMARY}"/>
      <circle cx="549" cy="182" r="4" fill="${p.PRIMARY}"/>
      <path d="M570,179 L576,185 M576,179 L570,185" stroke="${p.MID}" stroke-width="1.4" opacity="0.5"/>
      <path d="M594,179 L600,185 M600,179 L594,185" stroke="${p.MID}" stroke-width="1.4" opacity="0.5"/>
      <circle cx="525" cy="204" r="4" fill="${p.PRIMARY}"/>
      <circle cx="549" cy="204" r="4" fill="${p.PRIMARY}"/>
      <circle cx="573" cy="204" r="4" fill="${p.PRIMARY}"/>
      <path d="M594,201 L600,207 M600,201 L594,207" stroke="${p.MID}" stroke-width="1.4" opacity="0.5"/>
      <circle cx="525" cy="226" r="4" fill="${p.PRIMARY}"/>
      <circle cx="549" cy="226" r="4" fill="${p.PRIMARY}"/>
      <circle cx="573" cy="226" r="4" fill="${p.PRIMARY}"/>
      <circle cx="597" cy="226" r="4" fill="${p.PRIMARY}"/>

      <!-- 采样柱状图 -->
      <rect x="668" y="125" width="182" height="120" rx="6" fill="none" stroke="${p.PRIMARY}" stroke-width="1.8"/>
      <text x="759" y="143" font-family="${FONT}" font-size="10" fill="${p.PRIMARY}" font-weight="600" letter-spacing="1" text-anchor="middle">NEXT TOKEN LOGITS</text>
      <line x1="685" y1="218" x2="835" y2="218" stroke="${p.MID}" stroke-width="1.5"/>
      <rect x="700" y="202" width="16" height="16" rx="2" fill="none" stroke="${p.MID}" stroke-width="1.5"/>
      <text x="708" y="230" font-family="${FONT}" font-size="9" fill="${p.DEEP}" text-anchor="middle">w₁</text>
      <rect x="726" y="186" width="16" height="32" rx="2" fill="none" stroke="${p.MID}" stroke-width="1.5"/>
      <text x="734" y="230" font-family="${FONT}" font-size="9" fill="${p.DEEP}" text-anchor="middle">w₂</text>
      <rect x="752" y="168" width="16" height="50" rx="2" fill="none" stroke="${p.PRIMARY}" stroke-width="2.2"/>
      <line x1="754" y1="172" x2="766" y2="172" stroke="${p.PRIMARY}" stroke-width="2"/>
      <text x="760" y="162" font-family="${FONT}" font-size="10" fill="${p.PRIMARY}" font-weight="600" text-anchor="middle">82%</text>
      <text x="760" y="230" font-family="${FONT}" font-size="9" fill="${p.DEEP}" text-anchor="middle">w*</text>
      <rect x="780" y="204" width="16" height="14" rx="2" fill="none" stroke="${p.MID}" stroke-width="1.5"/>
      <text x="788" y="230" font-family="${FONT}" font-size="9" fill="${p.DEEP}" text-anchor="middle">w₄</text>
      <rect x="806" y="196" width="16" height="22" rx="2" fill="none" stroke="${p.MID}" stroke-width="1.5"/>
      <text x="814" y="230" font-family="${FONT}" font-size="9" fill="${p.DEEP}" text-anchor="middle">w₅</text>

      <!-- 自回归闭环回路 -->
      <path d="M760,245 C760,296 700,296 640,296 L505,296 C462,296 462,240 462,110 C462,83 480,83 495,83" fill="none" stroke="${p.PRIMARY}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrowStrong)"/>
      <text x="640" y="288" font-family="${FONT}" font-size="11" fill="${p.PRIMARY}" font-weight="500" letter-spacing="1" text-anchor="middle">自回归闭环：预测即下一步输入</text>
    `
  } else if (style === 'iso') {
    // 2.5D 等距堆叠塔与四星外挂能力卫星
    const isoCube = (cx: number, cy: number, s: number, top: string, left: string, right: string) => {
      const kx = s * 0.866
      return `
        <polygon points="${cx},${cy - s} ${cx + kx},${cy - s / 2} ${cx},${cy} ${cx - kx},${cy - s / 2}" fill="${top}"/>
        <polygon points="${cx - kx},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx - kx},${cy + s / 2}" fill="${left}"/>
        <polygon points="${cx + kx},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx + kx},${cy + s / 2}" fill="${right}"/>
      `
    }
    scene = `
      <ellipse cx="640" cy="225" rx="165" ry="55" fill="none" stroke="${p.LIGHT}" stroke-width="1.6" stroke-dasharray="6 5"/>
      ${isoCube(640, 295, 30, p.PRIMARY, p.MID, p.LIGHT)}
      ${isoCube(640, 265, 30, p.MID, p.LIGHT, p.FAINT)}
      ${isoCube(640, 235, 30, p.PRIMARY, p.MID, p.LIGHT)}
      ${isoCube(640, 205, 30, p.MID, p.LIGHT, p.FAINT)}
      <line x1="640" y1="175" x2="640" y2="152" stroke="${p.PRIMARY}" stroke-width="2.2" stroke-dasharray="3 3"/>
      ${isoCube(640, 132, 20, p.PRIMARY, p.MID, p.LIGHT)}
      <circle cx="640" cy="132" r="28" fill="none" stroke="${p.PRIMARY}" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="640" y="72" font-family="${FONT}" font-size="11" fill="${p.PRIMARY}" font-weight="600" text-anchor="middle">能力涌现</text>

      <!-- 卫星群 -->
      ${isoCube(515, 140, 16, p.LIGHT, p.MID, p.PRIMARY)}
      <text x="515" y="172" font-family="${FONT}" font-size="11" fill="${p.DEEP}" font-weight="600" text-anchor="middle">RAG 检索</text>
      <line x1="538" y1="145" x2="610" y2="160" stroke="${p.MID}" stroke-width="1.6" stroke-dasharray="4 3"/>

      ${isoCube(765, 140, 16, p.LIGHT, p.MID, p.PRIMARY)}
      <text x="765" y="172" font-family="${FONT}" font-size="11" fill="${p.DEEP}" font-weight="600" text-anchor="middle">工具调用</text>
      <line x1="742" y1="145" x2="670" y2="160" stroke="${p.MID}" stroke-width="1.6" stroke-dasharray="4 3"/>

      ${isoCube(785, 235, 15, p.PRIMARY, p.LIGHT, p.MID)}
      <text x="785" y="266" font-family="${FONT}" font-size="11" fill="${p.DEEP}" font-weight="600" text-anchor="middle">验证核查</text>
      <line x1="760" y1="238" x2="685" y2="252" stroke="${p.MID}" stroke-width="1.6" stroke-dasharray="4 3"/>

      ${isoCube(495, 235, 15, p.MID, p.PRIMARY, p.LIGHT)}
      <text x="495" y="266" font-family="${FONT}" font-size="11" fill="${p.DEEP}" font-weight="600" text-anchor="middle">长期记忆</text>
      <line x1="520" y1="238" x2="595" y2="252" stroke="${p.MID}" stroke-width="1.6" stroke-dasharray="4 3"/>
    `
  } else {
    // 深底科技舱 (midnight / darkgold)
    scene = `
      <rect x="470" y="46" width="400" height="292" rx="18" fill="${p.BG}" stroke="${p.LIGHT}" stroke-width="1.2"/>
      <circle cx="670" cy="185" r="90" fill="none" stroke="${p.PRIMARY}" stroke-width="1.6" opacity="0.35"/>
      <circle cx="670" cy="185" r="60" fill="none" stroke="${p.PRIMARY}" stroke-width="1.6" opacity="0.65"/>
      <circle cx="670" cy="185" r="30" fill="none" stroke="${p.PRIMARY}" stroke-width="1.6" opacity="0.95"/>
      <circle cx="670" cy="185" r="12" fill="${p.PRIMARY}" filter="url(#glow)"/>
      <line x1="530" y1="290" x2="810" y2="290" stroke="${p.LIGHT}" stroke-width="1.2"/>
      <circle cx="530" cy="110" r="3" fill="${p.PRIMARY}"/>
      <circle cx="810" cy="260" r="2.5" fill="${p.MID}"/>
      <path d="M510,160 q40,-50 90,-30" fill="none" stroke="${p.MID}" stroke-width="1.4"/>
      <text x="670" y="255" font-family="${FONT}" font-size="9" fill="${p.PRIMARY}" font-weight="500" letter-spacing="2" text-anchor="middle">CORE REASONING ENGINE</text>
    `
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="width: 100%; height: 100%; display: block;">
  ${defs}
  <rect width="${W}" height="${H}" fill="${p.BG}"/>
  ${skeleton}
  ${scene}
</svg>`
}

/**
 * 纯前端基于 HTML5 Canvas 将 SVG 字符串光栅化导出为 1800 × 766 的 Retina 高清 PNG Blob
 */
export async function exportSvgToPngBlob(svgString: string, scale = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const W = 900 * scale
    const H = 383 * scale

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建 Canvas 2D 绘图上下文'))
        return
      }
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, W, H)
      canvas.toBlob(
        (pngBlob) => {
          if (pngBlob) {
            resolve(pngBlob)
          } else {
            reject(new Error('Canvas 导出 PNG 失败'))
          }
        },
        'image/png',
        1.0
      )
    }

    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(new Error(`SVG 载入失败: ${e}`))
    }

    img.src = url
  })
}
