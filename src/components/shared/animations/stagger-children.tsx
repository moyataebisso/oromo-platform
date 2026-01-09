'use client'

import { useEffect, useRef, useState, ReactNode, Children, cloneElement, isValidElement } from 'react'
import { cn } from '@/lib/utils'

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  duration?: number
  distance?: number
  once?: boolean
  threshold?: number
}

export const StaggerChildren = ({
  children,
  className,
  staggerDelay = 100,
  duration = 500,
  distance = 20,
  once = true,
  threshold = 0.1,
}: StaggerChildrenProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once, threshold])

  const childrenArray = Children.toArray(children)

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) return child

        return (
          <div
            key={index}
            className="transition-all"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
              transitionDuration: `${duration}ms`,
              transitionDelay: `${index * staggerDelay}ms`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
