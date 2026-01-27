'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FeedbackPanel } from './FeedbackPanel'
import { useFeedback } from './FeedbackProvider'

// Pages where the feedback button should NOT appear
const EXCLUDED_PATHS = [
  '/kids',
  '/admin',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
]

export const FeedbackButton = () => {
  const pathname = usePathname()
  const { commentCount } = useFeedback()
  const [isOpen, setIsOpen] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)
  const [shouldPulse, setShouldPulse] = useState(true)

  // Check if we should show the button on this path
  const shouldShow = !EXCLUDED_PATHS.some((path) => pathname?.startsWith(path))

  // Check localStorage for previous click
  useEffect(() => {
    const clicked = localStorage.getItem('odda_feedback_clicked')
    if (clicked) {
      setHasClicked(true)
      setShouldPulse(false)
    }
  }, [])

  const handleClick = () => {
    setIsOpen(true)
    if (!hasClicked) {
      localStorage.setItem('odda_feedback_clicked', 'true')
      setHasClicked(true)
      setShouldPulse(false)
    }
  }

  if (!shouldShow) {
    return null
  }

  return (
    <>
      {/* Feedback Button - positioned above BackToTop button */}
      <Button
        onClick={handleClick}
        size="icon"
        className={cn(
          'fixed bottom-20 right-6 z-40 h-12 w-12 rounded-full shadow-lg',
          'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600',
          'transition-all duration-300 hover:scale-110',
          shouldPulse && 'animate-pulse-subtle'
        )}
        aria-label="Leave feedback or report issues"
        title="Leave feedback or report issues"
      >
        <MessageSquare className="h-5 w-5" />
        {/* Comment count badge */}
        {commentCount > 0 && (
          <span
            className={cn(
              'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center',
              'rounded-full bg-green-500 text-xs font-medium text-white'
            )}
          >
            {commentCount > 99 ? '99+' : commentCount}
          </span>
        )}
      </Button>

      {/* Feedback Panel */}
      <FeedbackPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Subtle pulse animation styles */}
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite;
        }
      `}</style>
    </>
  )
}
