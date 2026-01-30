'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Star, Home, Play, Trophy, Lock, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AgeGateModal, hasCompletedAgeGate, getStoredAgeGroup, type UserAgeGroup } from '@/components/kids/age-gate-modal'
import { ParentalGate } from '@/components/kids/parental-gate'
import { AccountPrompt } from '@/components/kids/account-prompt'
import { KidsGuestProvider, useKidsGuest } from '@/contexts/kids-guest-context'

// Inner layout component that uses the guest context
function KidsLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAgeGate, setShowAgeGate] = useState(false)
  const [showParentalGate, setShowParentalGate] = useState(false)
  const [exitTarget, setExitTarget] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const { showAccountPrompt, dismissAccountPrompt, watchHistory, totalStars } = useKidsGuest()

  // Check age gate on mount
  useEffect(() => {
    setMounted(true)

    // Check if user has completed age gate
    if (!hasCompletedAgeGate()) {
      setShowAgeGate(true)
    } else {
      // Check if they selected a non-elementary option
      const ageGroup = getStoredAgeGroup()
      if (ageGroup && ageGroup !== 'elementary') {
        // They previously selected a different age group, redirect them
        const redirects: Record<UserAgeGroup, string> = {
          'elementary': '/kids',
          'middle-school': '/teens?grade=middle',
          'high-school': '/teens?grade=high',
          'adult': '/',
        }
        router.push(redirects[ageGroup])
      }
    }
  }, [router])

  // Handle age gate selection
  const handleAgeGateSelect = (ageGroup: UserAgeGroup) => {
    setShowAgeGate(false)
    // The modal handles navigation
  }

  // Handle attempt to exit kids zone
  const handleExitAttempt = (target: string) => {
    setExitTarget(target)
    setShowParentalGate(true)
  }

  // Handle successful parental gate
  const handleParentalSuccess = () => {
    setShowParentalGate(false)
    if (exitTarget) {
      router.push(exitTarget)
      setExitTarget(null)
    }
  }

  // Handle parental gate cancel
  const handleParentalCancel = () => {
    setShowParentalGate(false)
    setExitTarget(null)
  }

  // Don't render until mounted (to avoid hydration issues with localStorage)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌟</div>
          <p className="text-xl text-purple-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // Show age gate if needed
  if (showAgeGate) {
    return <AgeGateModal onSelect={handleAgeGateSelect} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-100">
      {/* Parental Gate Modal */}
      {showParentalGate && (
        <ParentalGate
          onSuccess={handleParentalSuccess}
          onCancel={handleParentalCancel}
        />
      )}

      {/* Account Prompt */}
      {showAccountPrompt && (
        <AccountPrompt
          totalStars={totalStars}
          videosWatched={watchHistory.length}
          onDismiss={dismissAccountPrompt}
        />
      )}

      {/* Kids Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - triggers parental gate on click */}
            <button
              onClick={() => handleExitAttempt('/')}
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-md">
                Oromo Kids
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/kids"
                className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-semibold text-lg transition-all"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link
                href="/kids/courses"
                className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-semibold text-lg transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Courses
              </Link>
              <Link
                href="/kids/watch"
                className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-semibold text-lg transition-all"
              >
                <Play className="w-5 h-5" />
                Videos
              </Link>
              <Link
                href="/kids/progress"
                className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-semibold text-lg transition-all"
              >
                <Trophy className="w-5 h-5" />
                My Stars
              </Link>
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Stars Display */}
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 rounded-full shadow-md">
                <Star className="w-5 h-5 text-yellow-700" fill="currentColor" />
                <span className="font-bold text-yellow-800">{totalStars}</span>
              </div>

              {/* Parent Access - triggers parental gate */}
              <Button
                variant="secondary"
                size="lg"
                className="text-lg font-semibold"
                onClick={() => handleExitAttempt('/parent-dashboard')}
              >
                <Lock className="w-5 h-5 mr-2" />
                Parent
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-200',
              isMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
            )}
          >
            <nav className="flex flex-col gap-2">
              {/* Stars Display - Mobile */}
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 rounded-full shadow-md mx-auto mb-2">
                <Star className="w-5 h-5 text-yellow-700" fill="currentColor" />
                <span className="font-bold text-yellow-800">{totalStars} Stars</span>
              </div>

              <Link
                href="/kids"
                className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-6 h-6" />
                Home
              </Link>
              <Link
                href="/kids/courses"
                className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-6 h-6" />
                Courses
              </Link>
              <Link
                href="/kids/watch"
                className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Play className="w-6 h-6" />
                Videos
              </Link>
              <Link
                href="/kids/progress"
                className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-6 h-6" />
                My Stars
              </Link>
              <div className="pt-2 border-t border-white/30 mt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleExitAttempt('/parent-dashboard')
                  }}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Parent Access
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Kids Footer */}
      <footer className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex justify-center gap-2 mb-3">
            {['text-yellow-300', 'text-pink-300', 'text-green-300', 'text-blue-300', 'text-purple-300'].map((color, i) => (
              <Star key={i} className={cn('w-6 h-6', color)} fill="currentColor" />
            ))}
          </div>
          <p className="text-white font-medium text-lg">
            Made with love for young Oromo learners
          </p>
          <button
            onClick={() => handleExitAttempt('/')}
            className="mt-4 text-white/60 hover:text-white/80 text-sm underline transition-colors"
          >
            Exit Kids Zone
          </button>
        </div>
      </footer>
    </div>
  )
}

// Main layout component with provider
export default function KidsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KidsGuestProvider>
      <KidsLayoutInner>{children}</KidsLayoutInner>
    </KidsGuestProvider>
  )
}
