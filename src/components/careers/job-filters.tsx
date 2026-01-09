'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Plus, SlidersHorizontal, X, Bookmark, BookmarkCheck, Building2, Clock, DollarSign, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Job } from '@/types/careers'

interface JobFiltersProps {
  jobs: Job[]
  locations: string[]
}

const jobTypeColors: Record<string, string> = {
  'full-time': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'part-time': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'contract': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'internship': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const formatSalary = (min: number | null, max: number | null): string => {
  if (!min && !max) return 'Competitive'
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  if (min) return `From $${min.toLocaleString()}`
  if (max) return `Up to $${max.toLocaleString()}`
  return 'Competitive'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export const JobFilters = ({ jobs, locations }: JobFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs')
    if (saved) {
      setSavedJobs(JSON.parse(saved))
    }
  }, [])

  const toggleSaveJob = (jobId: string, jobTitle: string) => {
    setSavedJobs((prev) => {
      const newSaved = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
      localStorage.setItem('savedJobs', JSON.stringify(newSaved))

      if (newSaved.includes(jobId)) {
        toast.success('Job saved!', { description: jobTitle })
      } else {
        toast.info('Job removed from saved')
      }

      return newSaved
    })
  }

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase())

      // Location search filter
      const matchesLocationSearch = locationQuery === '' ||
        job.location?.toLowerCase().includes(locationQuery.toLowerCase())

      // Type filter
      const matchesType = selectedType === 'all' || job.job_type === selectedType

      // Location select filter
      const matchesLocation = selectedLocation === 'all' ||
        job.location === selectedLocation ||
        (selectedLocation === 'Remote' && job.location?.toLowerCase() === 'remote')

      // Saved filter
      const matchesSaved = !showSavedOnly || savedJobs.includes(job.id)

      return matchesSearch && matchesLocationSearch && matchesType && matchesLocation && matchesSaved
    })

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'salary-high':
        result.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0))
        break
      case 'salary-low':
        result.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0))
        break
    }

    return result
  }, [jobs, searchQuery, locationQuery, selectedType, selectedLocation, sortBy, showSavedOnly, savedJobs])

  const clearFilters = () => {
    setSearchQuery('')
    setLocationQuery('')
    setSelectedType('all')
    setSelectedLocation('all')
    setShowSavedOnly(false)
  }

  const hasActiveFilters = searchQuery !== '' || locationQuery !== '' ||
    selectedType !== 'all' || selectedLocation !== 'all' || showSavedOnly

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-900/50 via-background to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-3 h-3 mr-1" />
              Careers
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Oromo Careers
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find job opportunities within the Oromo professional network and community organizations.
            </p>

            {/* Search */}
            <div className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs, companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-10"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-card' : ''}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-card/80 backdrop-blur rounded-lg border border-border/50 max-w-2xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 text-left">
                      Job Type
                    </label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 text-left">
                      Location
                    </label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 text-left">
                      Sort by
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="salary-high">Highest salary</SelectItem>
                        <SelectItem value="salary-low">Lowest salary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters & Job Listings */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <Button
                variant={showSavedOnly ? 'gradient-secondary' : 'outline'}
                onClick={() => setShowSavedOnly(!showSavedOnly)}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved Jobs ({savedJobs.length})
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>

            <Button asChild variant="gradient-secondary">
              <Link href="/careers/post">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Link>
            </Button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs found
            </p>
          </div>

          {/* Job Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} variant="interactive" className="py-0">
                  <CardHeader className="pb-2 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                            <Link href={`/careers/${job.id}`}>{job.title}</Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">{job.company_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleSaveJob(job.id, job.title)}
                        >
                          {savedJobs.includes(job.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </Button>
                        <Badge className={cn('shrink-0 border', jobTypeColors[job.job_type])}>
                          {job.job_type.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(job.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 pb-6">
                    <Button asChild variant="gradient" className="w-full">
                      <Link href={`/careers/${job.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {showSavedOnly
                  ? "You haven't saved any jobs yet."
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
