import type { Metadata } from 'next'
import { tools } from '@/lib/playground'
import { LofiPedal, Pedal } from '@/components/pedal'

export const metadata: Metadata = { title: '游乐场' }

/** 游乐场：踏板板——每个工具一块踏板，信号链展示当前板面 */
export default function PlaygroundPage() {
  const chain = ['INPUT', ...tools.map((t) => t.name), 'LO-FI', 'OUTPUT']

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        Playground · 自用小工具集
      </h1>
      <p className="mt-4 text-sm text-muted">
        每个工具是一块踏板：踩下去，开始工作。新工具 = 新踏板。
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-5 sm:gap-6">
        {tools.map((tool) => (
          <Pedal
            key={tool.slug}
            name={tool.name}
            sub={tool.description}
            counter={tool.counter}
            href={`/playground/${tool.slug}/`}
          />
        ))}
        <LofiPedal />
      </div>

      <p className="mt-14 text-center font-mono text-[11px] tracking-[0.18em] text-muted">
        {chain.join(' → ')}
      </p>
    </div>
  )
}
