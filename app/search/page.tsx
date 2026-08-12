import type { Metadata } from 'next'
import { PagefindSearch } from '@/components/pagefind-search'

export const metadata: Metadata = { title: '搜索' }

export default function SearchPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">搜索</h1>
      <PagefindSearch />
    </div>
  )
}
