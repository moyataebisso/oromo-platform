import type { Metadata } from 'next'
import MiddleSchoolHeader from '@/components/middle-school/MiddleSchoolHeader'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Odda Academy Middle School | Learning for Grades 6-8',
  description: 'Educational resources, test prep, and career exploration for middle school students.',
}

export default function MiddleSchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
      <MiddleSchoolHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
