import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'ODDA Professional Network | Odda Academy',
  description: 'Connect with Oromo professionals worldwide. Build meaningful relationships, discover opportunities, and grow your career within our global community.',
  keywords: ['Oromo professionals', 'Oromo network', 'professional networking', 'Oromo diaspora', 'career networking'],
  openGraph: {
    title: 'ODDA Professional Network | Odda Academy',
    description: 'Connect with Oromo professionals worldwide. Build meaningful relationships and grow your career.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Odda Academy - Oromo Digital Development Association',
  },
}

interface OddaLayoutProps {
  children: React.ReactNode
}

export default function OddaLayout({ children }: OddaLayoutProps) {
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
