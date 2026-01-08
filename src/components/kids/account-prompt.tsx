'use client'

import Link from 'next/link'
import { X, Star, Save, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccountPromptProps {
  totalStars: number
  videosWatched: number
  onDismiss: () => void
}

export const AccountPrompt = ({ totalStars, videosWatched, onDismiss }: AccountPromptProps) => {
  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 relative">
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg">Great Progress!</h3>
              <p className="text-white/90 text-sm">Save your learning journey</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 bg-yellow-50">
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <span className="text-2xl font-bold text-slate-800">{totalStars}</span>
              </div>
              <p className="text-xs text-slate-500">Stars Earned</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl">📺</span>
                <span className="text-2xl font-bold text-slate-800">{videosWatched}</span>
              </div>
              <p className="text-xs text-slate-500">Videos Watched</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 text-center mb-4">
            Create a free account to save your progress and sync across devices!
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onDismiss}
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              asChild
            >
              <Link href="/signup?from=kids">
                <Save className="w-4 h-4 mr-2" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
