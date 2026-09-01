import type { Metadata } from 'next'
import { getAllGigs } from '@/lib/gigs'
import { GigTicket } from '@/components/gig-ticket'

export const metadata: Metadata = { title: '演出' }

/** 票根墙：每场 livehouse 演出一张票根，最近的贴在最上面 */
export default function GigsPage() {
  const gigs = getAllGigs()

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          Livehouse · 现场记录
        </h1>
        {gigs.length > 0 && (
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted">
            {gigs.length} STUBS
          </span>
        )}
      </div>
      {gigs.length === 0 ? (
        <p className="mt-12 text-sm text-muted">
          还没有票根。往 <code>content/gigs/</code> 里添一场演出，它就会贴在这面墙上。
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-6">
          {gigs.map((gig, i) => (
            <GigTicket key={gig.slug} gig={gig} flip={i % 2 === 1} />
          ))}
        </div>
      )}
    </div>
  )
}
