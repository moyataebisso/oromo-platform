'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useLinkPreview } from '@/hooks/useLinkPreview'
import { PreviewTooltipContent } from './PreviewTooltipContent'

interface LinkPreviewTooltipProps {
  href: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

export const LinkPreviewTooltip = ({
  href,
  children,
  className,
  disabled = false,
}: LinkPreviewTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'top' | 'bottom' })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [mounted, setMounted] = useState(false)

  const { preview, isLoading } = useLinkPreview(shouldFetch ? href : '')

  useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const calculatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipHeight = 120 // Approximate tooltip height
    const viewportHeight = window.innerHeight
    const spacing = 8

    // Determine if tooltip should appear above or below
    const spaceBelow = viewportHeight - rect.bottom
    const placement = spaceBelow < tooltipHeight + spacing ? 'top' : 'bottom'

    const top =
      placement === 'bottom'
        ? rect.bottom + spacing + window.scrollY
        : rect.top - tooltipHeight - spacing + window.scrollY

    // Center horizontally, but keep within viewport
    let left = rect.left + rect.width / 2 - 140 + window.scrollX // 140 = half of max-width 280
    left = Math.max(10, Math.min(left, window.innerWidth - 290))

    setPosition({ top, left, placement })
  }

  const handleMouseEnter = () => {
    if (disabled) return

    timeoutRef.current = setTimeout(() => {
      setShouldFetch(true)
      calculatePosition()
      setIsVisible(true)
    }, 300) // 300ms delay before showing
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  // Don't render tooltip if disabled or no preview available after fetch
  if (disabled) {
    return <span className={className}>{children}</span>
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn('inline-block', className)}
      >
        {children}
      </span>

      {mounted &&
        isVisible &&
        (isLoading || preview) &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-[100] w-[280px] rounded-lg border border-gray-700 bg-gray-800 shadow-xl',
              'transition-all duration-150',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Arrow */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 border-gray-700 rotate-45',
                position.placement === 'bottom'
                  ? '-top-1.5 border-l border-t'
                  : '-bottom-1.5 border-r border-b'
              )}
            />

            {/* Content */}
            <PreviewTooltipContent preview={preview} isLoading={isLoading} />
          </div>,
          document.body
        )}
    </>
  )
}
