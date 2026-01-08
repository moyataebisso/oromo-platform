'use client'

import { useEffect } from 'react'
import { RefreshCw, FileText, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function WikiError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Wiki error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Wiki Error
        </h1>
        <p className="text-slate-600 mb-8">
          We couldn&apos;t load the wiki content. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={reset} className="bg-amber-600 hover:bg-amber-700">
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
