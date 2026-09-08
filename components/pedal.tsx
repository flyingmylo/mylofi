'use client'

import Link from 'next/link'
import { lofiRadio } from '@/lib/lofi'
import { toggleLofi, useLofiPlaying } from '@/components/lofi-state'

type PedalProps = {
  name: string
  sub: string
}

const shell =
  'card-shadow group relative flex w-[210px] cursor-pointer flex-col items-start rounded-xl border border-line bg-paper p-5 text-left font-mono transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-px'

/** 游乐场工具卡片：整块可点，直接进入工具 */
export function Pedal({ name, sub, href }: PedalProps & { href: string }) {
  return (
    <Link href={href} className={shell}>
      <span className="text-[11px] font-medium tracking-[0.22em] text-ink group-hover:text-accent transition-colors">
        {name}
      </span>
      <span className="mt-2 text-[11px] leading-relaxed tracking-[0.04em] text-muted">
        {sub}
      </span>
    </Link>
  )
}

/** LO-FI 工具卡片：工具即右下角的电台本体，点击直接切换播放 */
export function LofiPedal() {
  const playing = useLofiPlaying()
  return (
    <button type="button" onClick={toggleLofi} className={shell}>
      <span className="text-[11px] font-medium tracking-[0.22em] text-ink group-hover:text-accent transition-colors">
        LO-FI
      </span>
      <span className="mt-2 text-[11px] leading-relaxed tracking-[0.04em] text-muted">
        电台 · {lofiRadio.title}
        <br />
        <span className={playing ? 'text-accent' : 'text-muted'}>
          {playing ? 'on' : 'off'}
        </span>
      </span>
    </button>
  )
}

