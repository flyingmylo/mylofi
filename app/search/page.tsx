import type { Metadata } from 'next'
import { PagefindSearch } from '@/components/pagefind-search'

export const metadata: Metadata = { title: '搜索' }

export default function SearchPage() {
  return (
    <div>
      <p className="font-mono text-xs text-accent">{"// grep -r \" keyword \" ."}</p>
      <h1 className="mt-4 mb-10 font-serif text-4xl font-bold tracking-tight">搜索</h1>
      <div className="rounded-xl border border-line bg-paper/50 p-6 shadow-sm backdrop-blur-md">
        <PagefindSearch />
      </div>
    </div>
  )
}
