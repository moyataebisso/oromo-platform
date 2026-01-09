'use client'

import Link from 'next/link'
import { X, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ProgressBannerProps {
  variant?: 'info' | 'success'
}

export const ProgressBanner = ({ variant = 'info' }: ProgressBannerProps) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  if (variant === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Progress saved to your account!
            </p>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">
              Your learning progress is synced across all devices.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            Sign up to save your progress
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your progress is saved locally. Create an account to sync across devices and track your learning journey.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
