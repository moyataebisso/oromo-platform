'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Star, MapPin, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Business, BUSINESS_CATEGORIES } from '@/types/business'
import { cn } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const premiumIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

interface BusinessMapProps {
  businesses: Business[]
  userLocation?: { lat: number; lng: number }
  className?: string
}

// Component to recenter map when data changes
function MapController({ businesses, userLocation }: { businesses: Business[]; userLocation?: { lat: number; lng: number } }) {
  const map = useMap()

  useEffect(() => {
    if (businesses.length === 0) return

    // Get all valid coordinates
    const coordinates = businesses
      .filter(b => b.latitude && b.longitude)
      .map(b => [b.latitude!, b.longitude!] as [number, number])

    if (userLocation) {
      coordinates.push([userLocation.lat, userLocation.lng])
    }

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
    }
  }, [businesses, userLocation, map])

  return null
}

export const BusinessMap = ({ businesses, userLocation, className }: BusinessMapProps) => {
  const [mapReady, setMapReady] = useState(false)

  // Default center (USA center) if no businesses have coordinates
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [39.8283, -98.5795]

  // Filter businesses with valid coordinates
  const businessesWithCoords = businesses.filter(b => b.latitude && b.longitude)

  // If no businesses have coordinates, show a placeholder
  if (businessesWithCoords.length === 0 && !userLocation) {
    return (
      <div className={cn(
        "h-[500px] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center",
        className
      )}>
        <div className="text-center text-slate-500 dark:text-slate-400">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No location data available</h3>
          <p className="text-sm">Business locations will appear here once added</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-[500px] rounded-lg overflow-hidden shadow-lg", className)}>
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        {/* Dark themed map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {mapReady && <MapController businesses={businessesWithCoords} userLocation={userLocation} />}

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center p-2">
                <p className="font-medium text-slate-900">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Business markers */}
        {businessesWithCoords.map((business) => {
          const category = BUSINESS_CATEGORIES.find(c => c.value === business.category)
          const isPremium = business.subscription_tier === 'premium' || business.is_featured

          return (
            <Marker
              key={business.id}
              position={[business.latitude!, business.longitude!]}
              icon={isPremium ? premiumIcon : defaultIcon}
            >
              <Popup>
                <div className="min-w-[200px] max-w-[280px]">
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={business.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-2xl">
                        {category?.icon || '🏪'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-slate-900 truncate">{business.name}</h3>
                        {isPremium && (
                          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {category?.icon} {category?.label}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-3 h-3',
                          star <= Math.round(business.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        )}
                      />
                    ))}
                    <span className="text-xs text-slate-600 ml-1">
                      {business.rating.toFixed(1)} ({business.review_count})
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-slate-600 mb-3">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {business.address}, {business.city}, {business.state}
                  </p>

                  {/* View Details Button */}
                  <Link href={`/businesses/${business.slug}`}>
                    <Button size="sm" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
