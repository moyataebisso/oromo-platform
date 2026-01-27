'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal, X, Navigation, List, Map as MapIcon, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BusinessCard } from './business-card'
import { Business, BusinessCategory, BUSINESS_CATEGORIES } from '@/types/business'
import { useGeolocation, calculateDistance } from '@/hooks/use-geolocation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Dynamically import the map to avoid SSR issues with Leaflet
const BusinessMap = dynamic(() => import('./business-map').then(mod => mod.BusinessMap), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-center text-slate-500">
        <MapIcon className="w-8 h-8 mx-auto mb-2 animate-pulse" />
        <p>Loading map...</p>
      </div>
    </div>
  ),
})

interface BusinessFiltersProps {
  businesses: Business[]
}

const CITIES = [
  'All Cities',
  'Minneapolis, MN',
  'Washington, DC',
  'Seattle, WA',
  'Atlanta, GA',
  'Dallas, TX',
]

const DISTANCE_OPTIONS = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
  { value: 100, label: '100 miles' },
  { value: -1, label: 'Any distance' },
]

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

export const BusinessFilters = ({ businesses }: BusinessFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [openNowOnly, setOpenNowOnly] = useState(false)
  const [maxDistance, setMaxDistance] = useState<number>(-1)

  const { latitude, longitude, loading: geoLoading, getCurrentPosition, error: geoError } = useGeolocation()

  // Calculate distances when we have user location
  const businessesWithDistance = useMemo(() => {
    if (latitude === null || longitude === null) {
      return businesses
    }

    return businesses.map(business => {
      // Use business coordinates if available, otherwise skip distance calculation
      if (business.latitude && business.longitude) {
        const distance = calculateDistance(latitude, longitude, business.latitude, business.longitude)
        return { ...business, distance }
      }
      return business
    })
  }, [businesses, latitude, longitude])

  const filteredBusinesses = useMemo(() => {
    let result = businessesWithDistance.filter((business) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === 'all' ||
        business.category === selectedCategory

      // City filter
      const matchesCity = selectedCity === 'all' ||
        `${business.city}, ${business.state}` === selectedCity

      // Open Now filter
      const matchesOpenNow = !openNowOnly || isOpenNow(business.hours)

      // Distance filter
      const matchesDistance = maxDistance === -1 ||
        (business.distance !== undefined && business.distance <= maxDistance)

      return matchesSearch && matchesCategory && matchesCity && matchesOpenNow && matchesDistance
    })

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        result.sort((a, b) => b.review_count - a.review_count)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'distance':
        result.sort((a, b) => {
          if (a.distance === undefined) return 1
          if (b.distance === undefined) return -1
          return a.distance - b.distance
        })
        break
    }

    return result
  }, [businessesWithDistance, searchQuery, selectedCategory, selectedCity, sortBy, openNowOnly, maxDistance])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedCity('all')
    setOpenNowOnly(false)
    setMaxDistance(-1)
  }

  const handleNearMe = () => {
    getCurrentPosition()
    if (!geoError) {
      setSortBy('distance')
      toast.success('Finding businesses near you...', {
        description: 'Results will be sorted by distance',
      })
    }
  }

  useEffect(() => {
    if (geoError) {
      toast.error('Location error', {
        description: geoError,
      })
    }
  }, [geoError])

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedCity !== 'all' || openNowOnly || maxDistance !== -1

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Discover Oromo Businesses
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Support our community by shopping local
            </p>

            {/* Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search by name, category, location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleNearMe}
                className="gap-2"
                disabled={geoLoading}
              >
                <Navigation className={cn("h-4 w-4", geoLoading && "animate-pulse")} />
                {geoLoading ? 'Finding...' : 'Near Me'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-slate-100 dark:bg-slate-800' : ''}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* View Toggle */}
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <MapIcon className="h-4 w-4" />
                Map View
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border shadow-sm max-w-2xl mx-auto text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {BUSINESS_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                      City
                    </label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {CITIES.slice(1).map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                      Distance
                    </label>
                    <Select value={maxDistance.toString()} onValueChange={(v) => setMaxDistance(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any distance" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTANCE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                      Sort by
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="distance">Nearest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Open Now Toggle */}
                <div className="mt-4 flex items-center gap-2">
                  <Switch
                    id="open-now"
                    checked={openNowOnly}
                    onCheckedChange={setOpenNowOnly}
                  />
                  <Label htmlFor="open-now" className="flex items-center gap-2 cursor-pointer">
                    <Clock className="w-4 h-4" />
                    Open Now
                  </Label>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
              className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 text-sm transition-colors"
              onClick={() => setSelectedCategory('all')}
            >
              All Businesses
            </Badge>
            {BUSINESS_CATEGORIES.slice(0, 10).map((cat) => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? 'secondary' : 'outline'}
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 text-sm transition-colors"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.icon} {cat.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Business Grid or Map */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {selectedCategory === 'all'
                  ? 'All Businesses'
                  : BUSINESS_CATEGORIES.find(c => c.value === selectedCategory)?.label || 'Businesses'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>

          {viewMode === 'map' ? (
            <BusinessMap
              businesses={filteredBusinesses}
              userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
            />
          ) : (
            <>
              {filteredBusinesses.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-3xl">
                    🏪
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No businesses found</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
