import { nowReading } from '@/lib/now'

/** 侧栏「正在读」：一句摘抄 + 走带式阅读进度 */
export function NowReading() {
  return (
    <div className="card-shadow rounded-xl border border-line bg-paper p-5">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        Now Reading · 正在读
      </h4>
      <p className="mt-4 font-serif italic leading-relaxed">「{nowReading.quote}」</p>
      <p className="mt-2 text-[13px] text-muted">
        {nowReading.book} — {nowReading.author}
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-[2px]">
        <span className="text-accent">{'▰'.repeat(nowReading.filled)}</span>
        <span className="text-line">{'▱'.repeat(nowReading.total - nowReading.filled)}</span>
      </p>
      <p className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-muted">
        {nowReading.note}
      </p>
    </div>
  )
}
