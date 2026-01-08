'use client'

import { useEffect } from 'react'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Something Went Wrong
          </h1>
          <p className="text-slate-600">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </p>
        </div>

        {/* Error Details (dev only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-700 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={reset} size="lg" className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-slate-500">
          Need help?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
