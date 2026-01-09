'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  threshold?: number
  formatNumber?: boolean
}

export const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className,
  threshold = 0.3,
  formatNumber = true,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted, threshold])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let animationFrame: number

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4)
    }

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)

      setCount(Math.floor(easedProgress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, hasStarted])

  const formattedCount = formatNumber
    ? count.toLocaleString()
    : count.toString()

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{formattedCount}{suffix}
    </span>
  )
}
