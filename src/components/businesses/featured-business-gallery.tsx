'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface FeaturedBusiness {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website?: string | null
}

interface FeaturedBusinessGalleryProps {
  className?: string
}

export const FeaturedBusinessGallery = ({
  className,
}: FeaturedBusinessGalleryProps) => {
  const [businesses, setBusinesses] = useState<FeaturedBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Fetch featured partners from database
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('businesses')
          .select('id, name, slug, logo_url, website')
          .or('is_featured.eq.true,show_on_homepage.eq.true')
          .in('status', ['active', 'approved'])
          .order('name')

        if (error) {
          console.warn('No partners found:', error)
          setBusinesses([])
        } else {
          setBusinesses(data || [])
        }
      } catch (err) {
        console.error('Error fetching partners:', err)
        setBusinesses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartners()
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <section className={cn('py-16 bg-[#0f0f1a] overflow-hidden', className)}>
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      </section>
    )
  }

  // Don't render section if no partners
  if (businesses.length === 0) return null

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...businesses, ...businesses]

  return (
    <section className={cn('py-16 bg-[#0f0f1a] overflow-hidden', className)}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <img
              src="https://edjeenuhmorqmjvedpem.supabase.co/storage/v1/object/public/business-logos/oromia-flag.png"
              alt="Oromo Flag"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Featured Partners
              </h2>
              <p className="text-slate-400">
                Trusted by Oromo organizations worldwide
              </p>
            </div>
          </div>

          <Link
            href="/businesses"
            className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors hover:gap-3"
          >
            View All Businesses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Scrolling Carousel */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0f0f1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0f0f1a] to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={cn(
              "flex gap-6 py-4",
              isPaused ? "animate-scroll-paused" : "animate-scroll"
            )}
            style={{ width: 'max-content' }}
          >
            {duplicatedPartners.map((partner, index) => (
              <a
                key={`${partner.id}-${index}`}
                href={partner.website || `/businesses/${partner.slug}`}
                target={partner.website ? '_blank' : undefined}
                rel={partner.website ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:-translate-y-1 min-w-[160px] flex-shrink-0"
              >
                {/* Logo container */}
                <div className="w-20 h-20 mb-4 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  {/* Fallback icon */}
                  <div className={cn(
                    "w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center",
                    partner.logo_url ? "hidden" : ""
                  )}>
                    <Building2 className="w-10 h-10 text-blue-500" />
                  </div>
                </div>

                {/* Partner name */}
                <p className="text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {partner.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="mx-auto max-w-7xl px-4 mt-8 sm:hidden">
        <Link
          href="/businesses"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
        >
          View All Businesses
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll-paused {
          animation: scroll 30s linear infinite;
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
