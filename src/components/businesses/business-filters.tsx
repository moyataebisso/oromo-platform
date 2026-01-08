'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, SlidersHorizontal, X, Navigation } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BusinessCard } from './business-card'
import { Business, BusinessCategory, BUSINESS_CATEGORIES } from '@/types/business'
import { toast } from 'sonner'

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

export const BusinessFilters = ({ businesses }: BusinessFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [showFilters, setShowFilters] = useState(false)

  const filteredBusinesses = useMemo(() => {
    let result = businesses.filter((business) => {
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

      return matchesSearch && matchesCategory && matchesCity
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
    }

    return result
  }, [businesses, searchQuery, selectedCategory, selectedCity, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedCity('all')
  }

  const handleNearMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          toast.success('Location detected!', {
            description: 'Showing businesses near you (demo mode)',
          })
        },
        () => {
          toast.error('Could not get your location', {
            description: 'Please enable location access or select a city',
          })
        }
      )
    } else {
      toast.error('Geolocation not supported')
    }
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedCity !== 'all'

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Oromo Business Directory
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Discover and support Oromo-owned businesses in your community
            </p>

            {/* Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search businesses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleNearMe}
                className="gap-2"
              >
                <Navigation className="h-4 w-4" />
                Near Me
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-slate-100' : ''}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2 text-left">
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
                    <label className="text-sm font-medium text-slate-700 block mb-2 text-left">
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
                    <label className="text-sm font-medium text-slate-700 block mb-2 text-left">
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
              className="cursor-pointer hover:bg-slate-200 px-4 py-2 text-sm transition-colors"
              onClick={() => setSelectedCategory('all')}
            >
              All Businesses
            </Badge>
            {BUSINESS_CATEGORIES.map((cat) => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? 'secondary' : 'outline'}
                className="cursor-pointer hover:bg-slate-100 px-4 py-2 text-sm transition-colors"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.icon} {cat.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Business Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedCategory === 'all'
                  ? 'All Businesses'
                  : BUSINESS_CATEGORIES.find(c => c.value === selectedCategory)?.label || 'Businesses'}
              </h2>
              <p className="text-slate-600">
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

          {filteredBusinesses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                🏪
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No businesses found</h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
