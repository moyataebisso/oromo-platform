'use client'

import Link from 'next/link'
import { MapPin, Star, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Business, BUSINESS_CATEGORIES } from '@/types/business'

interface BusinessCardProps {
  business: Business
  className?: string
}

const isOpenNow = (hours: Business['hours']): boolean => {
  if (!hours) return false
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof hours
  const todayHours = hours[dayName]

  if (!todayHours) return false

  const currentTime = now.getHours() * 100 + now.getMinutes()
  const openTime = parseInt(todayHours.open.replace(':', ''))
  const closeTime = parseInt(todayHours.close.replace(':', ''))

  return currentTime >= openTime && currentTime <= closeTime
}

export const BusinessCard = ({ business, className }: BusinessCardProps) => {
  const category = BUSINESS_CATEGORIES.find(c => c.value === business.category)
  const open = isOpenNow(business.hours)

  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-all duration-200 group', className)}>
      <Link href={`/businesses/${business.id}`}>
        {/* Cover Image */}
        <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-teal-100">
          {business.cover_image_url ? (
            <img
              src={business.cover_image_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {category?.icon || '🏪'}
            </div>
          )}

          {/* Open/Closed Badge */}
          {business.hours && (
            <Badge
              className={cn(
                'absolute top-3 right-3',
                open ? 'bg-green-500' : 'bg-slate-500'
              )}
            >
              <Clock className="w-3 h-3 mr-1" />
              {open ? 'Open Now' : 'Closed'}
            </Badge>
          )}

          {/* Logo */}
          {business.logo_url && (
            <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-lg bg-white shadow-md overflow-hidden border-2 border-white">
              <img
                src={business.logo_url}
                alt={`${business.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <CardContent className={cn('p-4', business.logo_url && 'pt-8')}>
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {category?.icon} {category?.label}
            </Badge>
            {business.is_verified && (
              <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {business.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{business.city}, {business.state}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= Math.round(business.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  )}
                />
              ))}
              <span className="text-sm text-slate-600 ml-1">
                ({business.review_count})
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
