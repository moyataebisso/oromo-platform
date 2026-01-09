'use client'

import { useState, useMemo } from 'react'
import { Search, Link2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ResourceCard } from './resource-card'
import { Resource, ResourceCategory, resourceCategoryLabels, resourceCategoryIcons } from '@/types/resources'

interface ResourceFiltersProps {
  resources: Resource[]
}

const categories: { value: ResourceCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🔗' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'organization', label: 'Organizations', icon: '🏛️' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'other', label: 'Other', icon: '🔗' },
]

export const ResourceFilters = ({ resources }: ResourceFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all')

  const featuredResources = useMemo(() => {
    return resources.filter(r => r.is_featured)
  }, [resources])

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = searchQuery === '' ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'all' ||
        resource.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [resources, searchQuery, selectedCategory])

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-purple-900/50 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400">
              <Link2 className="w-3 h-3 mr-1" />
              Resources
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Trusted Resources
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Curated links to help our community learn, connect, and grow.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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

      {/* Featured Resources */}
      {selectedCategory === 'all' && searchQuery === '' && featuredResources.length > 0 && (
        <section className="py-12 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory === 'all' ? 'All Resources' : resourceCategoryLabels[selectedCategory]}
            </h2>
            <p className="text-muted-foreground">
              {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
