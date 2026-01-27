import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oromo Business Directory | ODDA',
  description: 'Discover and support Oromo-owned businesses in your community. Find restaurants, groceries, professional services, and more.',
  keywords: ['Oromo businesses', 'Ethiopian businesses', 'African businesses', 'local businesses', 'Oromo community'],
  openGraph: {
    title: 'Oromo Business Directory | ODDA',
    description: 'Discover and support Oromo-owned businesses in your community. Find restaurants, groceries, professional services, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ODDA - Oromo Digital Development Association',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oromo Business Directory | ODDA',
    description: 'Discover and support Oromo-owned businesses in your community.',
  },
}

export default function BusinessesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
