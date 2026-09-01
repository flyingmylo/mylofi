'use client'

import Link from 'next/link'
import { lofiRadio } from '@/lib/lofi'
import { toggleLofi, useLofiPlaying } from '@/components/lofi-state'

type PedalProps = {
  name: string
  sub: string
  counter: string
}

const shell =
  'card-shadow group relative flex w-[200px] cursor-pointer flex-col items-center rounded-xl border border-line bg-paper px-5 pb-6 pt-5 text-center font-mono transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-px'

const ring =
  'block size-[38px] rounded-full border-[1.5px] border-muted transition-[border-color,transform] duration-150 group-hover:border-accent group-active:scale-95'

/** 纸墨踏板：形制保留隐喻（铭牌/计数屏/脚踏圆），整块可点，直接进入工具 */
export function Pedal({ name, sub, counter, href }: PedalProps & { href: string }) {
  return (
    <Link href={href} className={shell}>
      <span className="text-[11px] tracking-[0.22em] text-ink">{name}</span>
      <span className="mt-2 text-[10px] leading-relaxed tracking-[0.06em] text-muted">{sub}</span>
      <span className="mt-4 mb-5 text-[12px] tracking-[0.24em] text-accent">{counter}</span>
      <span aria-hidden className={ring} />
    </Link>
  )
}

/** LO-FI 踏板：工具即右下角的电台本体，点击直接切换播放 */
export function LofiPedal() {
  const playing = useLofiPlaying()
  return (
    <button type="button" onClick={toggleLofi} className={shell}>
      <span className="text-[11px] tracking-[0.22em] text-ink">LO-FI</span>
      <span className="mt-2 text-[10px] leading-relaxed tracking-[0.06em] text-muted">
        电台 · {lofiRadio.title}
      </span>
      <span className="mt-4 mb-5 text-[12px] tracking-[0.24em] text-accent">
        {playing ? 'ON AIR' : '33⅓ RPM'}
      </span>
      <span aria-hidden className={ring} />
    </button>
  )
}
