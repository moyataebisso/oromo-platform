'use client'

import { useState, useMemo } from 'react'
import { Search, Calendar, List, MapPin, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EventCard } from './event-card'
import { Event, EventCategory, eventCategoryLabels, eventCategoryIcons } from '@/types/events'

interface EventFiltersProps {
  events: Event[]
}

const categories: { value: EventCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Events', icon: '📅' },
  { value: 'community', label: 'Community', icon: '👥' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'educational', label: 'Educational', icon: '📚' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'religious', label: 'Religious', icon: '🙏' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'fundraiser', label: 'Fundraiser', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📅' },
]

type ViewMode = 'grid' | 'list' | 'calendar'
type TimeFilter = 'upcoming' | 'today' | 'this-week' | 'this-month' | 'past'

export const EventFilters = ({ events }: EventFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming')
  const [locationFilter, setLocationFilter] = useState<string>('')

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const featuredEvents = useMemo(() => {
    return events.filter(e => e.is_featured && new Date(e.start_date) >= today)
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date)

      // Search filter
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city?.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === 'all' ||
        event.category === selectedCategory

      // Time filter
      let matchesTime = true
      switch (timeFilter) {
        case 'upcoming':
          matchesTime = eventDate >= today
          break
        case 'today':
          matchesTime = eventDate.toDateString() === today.toDateString()
          break
        case 'this-week':
          matchesTime = eventDate >= today && eventDate <= endOfWeek
          break
        case 'this-month':
          matchesTime = eventDate >= today && eventDate <= endOfMonth
          break
        case 'past':
          matchesTime = eventDate < today
          break
      }

      // Location filter
      const matchesLocation = locationFilter === '' ||
        event.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        event.state?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        event.country?.toLowerCase().includes(locationFilter.toLowerCase())

      return matchesSearch && matchesCategory && matchesTime && matchesLocation
    }).sort((a, b) => {
      // Sort by date
      if (timeFilter === 'past') {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      }
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    })
  }, [events, searchQuery, selectedCategory, timeFilter, locationFilter])

  // Get unique locations for suggestion
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>()
    events.forEach(event => {
      if (event.city) locations.add(event.city)
      if (event.state) locations.add(event.state)
    })
    return Array.from(locations).slice(0, 10)
  }, [events])

  // Group events by month for calendar view
  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, Event[]> = {}
    filteredEvents.forEach(event => {
      const date = new Date(event.start_date)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(event)
    })
    return grouped
  }, [filteredEvents])

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-900/50 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-3 h-3 mr-1" />
              Events
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Community Events
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover and connect with the Oromo community through events worldwide.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location..."
                  className="pl-10 w-40"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time and View Filters */}
      <section className="py-4 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Time filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'today', label: 'Today' },
                { value: 'this-week', label: 'This Week' },
                { value: 'this-month', label: 'This Month' },
                { value: 'past', label: 'Past' },
              ].map((filter) => (
                <Badge
                  key={filter.value}
                  variant={timeFilter === filter.value ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5 transition-all hover:scale-105"
                  onClick={() => setTimeFilter(filter.value as TimeFilter)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>

            {/* View mode toggle */}
            <div className="flex gap-1 bg-card/50 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                onClick={() => setSelectedCategory(category.value)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {selectedCategory === 'all' && searchQuery === '' && timeFilter === 'upcoming' && featuredEvents.length > 0 && (
        <section className="py-12 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {timeFilter === 'past' ? 'Past Events' : 'All Events'}
            </h2>
            <p className="text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </p>
          </div>

          {filteredEvents.length > 0 ? (
            viewMode === 'calendar' ? (
              // Calendar View
              <div className="space-y-8">
                {Object.entries(eventsByMonth).map(([key, monthEvents]) => {
                  const [year, month] = key.split('-').map(Number)
                  const monthName = new Date(year, month).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })
                  return (
                    <div key={key}>
                      <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border/50">
                        {monthName}
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {monthEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : viewMode === 'list' ? (
              // List View
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              // Grid View
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search, category, or time filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
