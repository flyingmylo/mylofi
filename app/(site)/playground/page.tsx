import type { Metadata } from 'next'
import { tools } from '@/lib/playground'
import { LofiPedal, Pedal } from '@/components/pedal'

export const metadata: Metadata = { title: '游乐场' }

/** 游乐场：自用小工具集 */
export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        Playground · 自用小工具集
      </h1>

      <div className="mt-8 flex flex-wrap justify-start gap-5 sm:gap-6">
        {tools.map((tool) => (
          <Pedal
            key={tool.slug}
            name={tool.name}
            sub={tool.description}
            href={`/playground/${tool.slug}/`}
          />
        ))}
        <LofiPedal />
      </div>
    </div>
  )
}
