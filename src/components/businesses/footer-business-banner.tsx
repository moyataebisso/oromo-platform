'use client'

import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterBusiness {
  id: string
  name: string
  slug: string
  logo_url: string | null
  category_icon?: string
}

// Mock data - will be replaced with Supabase query
const mockFooterBusinesses: FooterBusiness[] = [
  { id: '1', name: 'Oromia Restaurant', slug: 'oromia-restaurant', logo_url: null, category_icon: '🍽️' },
  { id: '2', name: 'Buna Coffee House', slug: 'buna-coffee-house', logo_url: null, category_icon: '☕' },
  { id: '3', name: 'Oromo Market', slug: 'oromo-market', logo_url: null, category_icon: '🛒' },
  { id: '4', name: 'Gadaa Legal', slug: 'gadaa-legal', logo_url: null, category_icon: '⚖️' },
  { id: '5', name: 'Harar Beauty', slug: 'harar-beauty', logo_url: null, category_icon: '💇' },
  { id: '6', name: 'Abbaa Realty', slug: 'abbaa-realty', logo_url: null, category_icon: '🏠' },
]

interface FooterBusinessBannerProps {
  businesses?: FooterBusiness[]
  className?: string
}

export const FooterBusinessBanner = ({
  businesses = mockFooterBusinesses,
  className,
}: FooterBusinessBannerProps) => {
  if (businesses.length === 0) return null

  return (
    <div className={cn('bg-slate-800/50 backdrop-blur-sm py-6 border-b border-slate-700/50', className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">Support Oromo Businesses</span>
          </div>

          {/* Business Logos - Scrolling on mobile, static on desktop */}
          <div className="flex items-center gap-4 overflow-x-auto max-w-full sm:max-w-none scrollbar-hide">
            {businesses.slice(0, 6).map((business) => (
              <Link
                key={business.id}
                href={`/businesses/${business.slug}`}
                className="flex-shrink-0 group"
                title={business.name}
              >
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-all duration-200 group-hover:scale-110 border border-slate-600/50">
                  {business.logo_url ? (
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="w-8 h-8 object-contain rounded"
                    />
                  ) : (
                    <span className="text-2xl">{business.category_icon || '🏪'}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* View All Link */}
          <Link
            href="/businesses"
            className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            View Directory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
