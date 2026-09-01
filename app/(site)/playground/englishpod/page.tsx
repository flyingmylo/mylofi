import type { Metadata } from 'next'
import { EnglishpodBrowserPage } from '@/components/englishpod/browser-page'

export const metadata: Metadata = { title: 'Englishpod' }

export default function EnglishpodPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <EnglishpodBrowserPage group={1} />
    </div>
  )
}
