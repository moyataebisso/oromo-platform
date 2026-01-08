'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export type UserAgeGroup = 'elementary' | 'middle-school' | 'high-school' | 'adult'

interface AgeOption {
  id: UserAgeGroup
  label: string
  ageRange: string
  emoji: string
  color: string
  hoverColor: string
  href: string
}

const ageOptions: AgeOption[] = [
  {
    id: 'elementary',
    label: 'Elementary',
    ageRange: 'Under 12',
    emoji: '🎒',
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    hoverColor: 'hover:from-green-500 hover:to-green-700',
    href: '/kids',
  },
  {
    id: 'middle-school',
    label: 'Middle School',
    ageRange: 'Ages 12-14',
    emoji: '📚',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    hoverColor: 'hover:from-blue-500 hover:to-blue-700',
    href: '/teens?grade=middle',
  },
  {
    id: 'high-school',
    label: 'High School',
    ageRange: 'Ages 15-18',
    emoji: '🎓',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    hoverColor: 'hover:from-purple-500 hover:to-purple-700',
    href: '/teens?grade=high',
  },
  {
    id: 'adult',
    label: 'Adult',
    ageRange: '18+',
    emoji: '👤',
    color: 'bg-gradient-to-br from-slate-400 to-slate-600',
    hoverColor: 'hover:from-slate-500 hover:to-slate-700',
    href: '/',
  },
]

interface AgeGateModalProps {
  onSelect: (ageGroup: UserAgeGroup) => void
}

export const AgeGateModal = ({ onSelect }: AgeGateModalProps) => {
  const router = useRouter()

  const handleSelect = (option: AgeOption) => {
    // Save to localStorage
    localStorage.setItem('user_age_group', option.id)

    // Call the onSelect callback
    onSelect(option.id)

    // Navigate to the appropriate page
    router.push(option.href)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>⭐</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎉</div>
        <div className="absolute top-1/4 left-1/4 text-4xl animate-pulse">🌈</div>
        <div className="absolute bottom-1/4 right-1/4 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>📖</div>
      </div>

      {/* Modal Content */}
      <div className="relative z-10 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Oromo! 👋
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow">
            Select your age group to get started
          </p>
        </div>

        {/* Age Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {ageOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={cn(
                'group relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50',
                option.color,
                option.hoverColor
              )}
              style={{ minHeight: '140px' }}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-5xl md:text-6xl mb-3 transform group-hover:scale-110 transition-transform">
                  {option.emoji}
                </span>
                <h3 className="text-xl md:text-2xl font-bold mb-1">
                  {option.label}
                </h3>
                <p className="text-white/80 text-sm md:text-base">
                  {option.ageRange}
                </p>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/70 text-sm mt-6">
          You can change this anytime from settings
        </p>
      </div>
    </div>
  )
}

// Helper to check if age gate has been completed
export const hasCompletedAgeGate = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('user_age_group') !== null
}

// Helper to get stored age group
export const getStoredAgeGroup = (): UserAgeGroup | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('user_age_group') as UserAgeGroup | null
}

// Helper to clear age group (for testing/reset)
export const clearAgeGroup = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user_age_group')
}
