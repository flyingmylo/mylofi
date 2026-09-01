import type { Metadata } from 'next'
import { PagefindSearch } from '@/components/pagefind-search'

export const metadata: Metadata = { title: '搜索' }

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-10 font-serif text-3xl font-semibold tracking-tight">搜索</h1>
      <PagefindSearch />
    </div>
  )
}
