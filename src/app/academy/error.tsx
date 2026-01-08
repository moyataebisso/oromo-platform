'use client'

import { useEffect } from 'react'
import { RefreshCw, BookOpen, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AcademyError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Academy error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Academy Error
        </h1>
        <p className="text-slate-600 mb-8">
          We couldn&apos;t load the academy content. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
