import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Community Forum | Odda Academy',
  description: 'Connect, share, and learn with the Oromo community worldwide. Join discussions, ask questions, and engage with fellow community members.',
  keywords: ['Oromo community', 'Oromo forum', 'Oromo discussions', 'Oromo diaspora', 'community forum'],
  openGraph: {
    title: 'Community Forum | Odda Academy',
    description: 'Connect, share, and learn with the Oromo community worldwide.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Odda Academy - Oromo Digital Development Association',
  },
}

interface CommunityLayoutProps {
  children: React.ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
