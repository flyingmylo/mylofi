import type { Gig } from '@/lib/gigs'

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/** 纸质票根：主联（日期/演出/场地/感受）+ 存根（撕票线、ADMIT ONE、编号、印章） */
export function GigTicket({ gig, flip = false }: { gig: Gig; flip?: boolean }) {
  const [y, m, d] = gig.date.split('-')
  // 中午 12 点取星期，避免跨时区算错
  const weekday = WEEKDAYS[new Date(`${gig.date}T12:00:00`).getDay()]

  return (
    <article
      className={`card-shadow relative grid overflow-hidden rounded-xl border border-line bg-paper transition-transform duration-200 hover:-translate-y-0.5 ${
        flip
          ? 'sm:grid-cols-[128px_minmax(0,1fr)]'
          : 'sm:grid-cols-[minmax(0,1fr)_128px]'
      }`}
    >
      {/* 撕票口打孔（贴着存根侧的撕票线中点） */}
      <i
        aria-hidden
        className={`absolute top-1/2 z-10 size-4 -translate-y-1/2 rounded-full border border-line bg-bg max-sm:hidden ${
          flip ? '-left-2' : '-right-2'
        }`}
      />

      <div className={`min-w-0 p-6 ${flip ? 'sm:order-2' : ''}`}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-4xl leading-none">{d}</span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted">
            {y}.{m} · {weekday}
          </span>
          {gig.upcoming && (
            <span className="rounded-full border border-accent px-2.5 py-0.5 font-mono text-[10px] tracking-[0.2em] text-accent">
              即将上演
            </span>
          )}
        </div>
        <h3 className="mt-2.5 font-serif text-xl leading-snug">
          {gig.band}
          {gig.tour && <span className="text-muted">「{gig.tour}」</span>}
        </h3>
        <p className="mt-1.5 font-mono text-[11px] tracking-[0.12em] text-muted">
          {gig.venue} · {gig.city}
          {gig.price && ` · ${gig.price}`}
        </p>
        {gig.note && (
          <p className="mt-3 font-serif text-sm italic leading-relaxed text-muted">
            「{gig.note}」
          </p>
        )}
      </div>

      <div
        className={`flex flex-row items-center justify-center gap-3 border-line/80 border-t border-dashed px-4 py-3 max-sm:justify-start sm:flex-col sm:gap-4 sm:border-l sm:border-t-0 sm:px-3 sm:py-4 ${
          flip ? 'sm:order-1 sm:border-l-0 sm:border-r sm:border-dashed' : ''
        }`}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent [writing-mode:vertical-rl] max-sm:[writing-mode:horizontal-tb] max-sm:tracking-[0.3em]">
          ADMIT ONE
        </span>
        {!gig.upcoming && (
          <span className="rounded-md border-2 border-muted/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/90 sm:-rotate-6">
            LIVE
          </span>
        )}
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted">{gig.stub}</span>
      </div>
    </article>
  )
}
