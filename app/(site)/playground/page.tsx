import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { tools } from '@/lib/playground'

export const metadata: Metadata = { title: '游乐场' }

export default function PlaygroundPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight">游乐场</h1>
      <p className="mt-4 text-sm text-muted">一些自己写着玩的小工具。</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/playground/${tool.slug}/`}
            className="group rounded-lg border border-line/70 p-6 transition-colors hover:border-accent/60"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-lg leading-snug transition-colors duration-200 group-hover:text-accent">
                {tool.name}
              </h2>
              <ArrowRight
                size={15}
                className="mt-1 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
