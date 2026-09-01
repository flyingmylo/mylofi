import Link from 'next/link'
import { getNextGig } from '@/lib/gigs'

/** 侧栏「下一场」：最近一场未上演的演出；没有就不显示 */
export function NextGig() {
  const gig = getNextGig()
  if (!gig) return null
  const [y, m, d] = gig.date.split('-')

  return (
    <div className="card-shadow rounded-xl border border-line bg-paper p-5">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        Next Gig · 下一场
      </h4>
      <div className="mt-3 flex items-baseline gap-2.5">
        <span className="font-serif text-3xl leading-none">{d}</span>
        <span className="font-mono text-[10.5px] tracking-[0.18em] text-muted">
          {y}.{m}
        </span>
      </div>
      <p className="mt-2 truncate font-serif text-base">{gig.band}</p>
      <p className="truncate font-mono text-[10.5px] tracking-[0.12em] text-muted">
        {gig.venue} · {gig.city}
      </p>
      <Link
        href="/gigs/"
        className="mt-3 inline-block font-mono text-[11px] tracking-[0.2em] text-muted transition-colors hover:text-accent"
      >
        票根墙 GIGS →
      </Link>
    </div>
  )
}
