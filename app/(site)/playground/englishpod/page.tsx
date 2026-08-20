import type { Metadata } from 'next'
import { EnglishpodBrowserPage } from '@/components/englishpod/browser-page'

export const metadata: Metadata = { title: 'Englishpod' }

export default function EnglishpodPage() {
  return <EnglishpodBrowserPage group={1} />
}
