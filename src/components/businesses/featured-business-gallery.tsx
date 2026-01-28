'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeaturedBusiness {
  id: string
  name: string
  slug: string
  logo_url: string | null
  category_icon?: string
  external_url?: string
}

const featuredBusinesses: FeaturedBusiness[] = [
  { id: '1', name: 'Adama Restaurant & Awash Bakery', slug: 'adama-restaurant', logo_url: null, category_icon: '🍽️', external_url: 'https://adamarestaurantmn.com' },
  { id: '2', name: 'Glory Collective Studios', slug: 'glory-collective-studios', logo_url: null, category_icon: '🎬', external_url: 'https://www.peerspace.com/pages/listings/694ce7ba213483499e2c059e' },
  { id: '3', name: 'OSFNA', slug: 'osfna', logo_url: null, category_icon: '⚽', external_url: 'https://www.osfna.org/' },
  { id: '4', name: 'Khan Academy', slug: 'khan-academy', logo_url: null, category_icon: '📚', external_url: 'https://www.khanacademy.org/' },
  { id: '5', name: 'Oromo Media Network', slug: 'omn', logo_url: null, category_icon: '📰', external_url: 'https://omn.today/' },
  { id: '6', name: 'Oromo Platform', slug: 'oromo-platform', logo_url: null, category_icon: '🎓', external_url: 'https://oromo-platform.vercel.app/' },
]

interface FeaturedBusinessGalleryProps {
  businesses?: FeaturedBusiness[]
  className?: string
}

export const FeaturedBusinessGallery = ({
  businesses = featuredBusinesses,
  className,
}: FeaturedBusinessGalleryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let isPaused = false
    let position = 0
    const speed = 0.5 // pixels per frame

    const animate = () => {
      if (!isPaused && scrollContainer) {
        position += speed
        const maxScroll = scrollContainer.scrollWidth / 2
        if (position >= maxScroll) {
          position = 0
        }
        scrollContainer.scrollLeft = position
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => { isPaused = true }
    const handleMouseLeave = () => { isPaused = false }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer?.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (businesses.length === 0) return null

  // Double the businesses for seamless infinite scroll
  const displayBusinesses = [...businesses, ...businesses]

  return (
    <section className={cn('py-16 bg-slate-50 dark:bg-slate-900/50 overflow-hidden', className)}>
      <div className="mx-auto max-w-7xl px-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Featured Partners
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Trusted by Oromo businesses across America
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/businesses">
              View All Businesses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Scrolling Gallery */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {displayBusinesses.map((business, index) => (
          <a
            key={`${business.id}-${index}`}
            href={business.external_url || `/businesses/${business.slug}`}
            target={business.external_url ? '_blank' : undefined}
            rel={business.external_url ? 'noopener noreferrer' : undefined}
            className="flex-shrink-0 group"
          >
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-slate-100 dark:border-slate-700 animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-20 h-20 object-contain rounded-lg"
                />
              ) : (
                <span className="text-5xl">{business.category_icon || '🏪'}</span>
              )}
            </div>
            <p className="text-center mt-2 text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[128px]">
              {business.name}
            </p>
          </a>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mx-auto max-w-7xl px-4 mt-8 sm:hidden">
        <Button variant="outline" asChild className="w-full">
          <Link href="/businesses">
            View All Businesses
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
