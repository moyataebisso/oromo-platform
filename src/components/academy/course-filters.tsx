'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, GraduationCap } from 'lucide-react'
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
import { CourseGrid } from '@/components/academy/course-grid'
import { Course, Category } from '@/types/academy'

interface CourseFiltersProps {
  courses: Course[]
  categories: Category[]
}

export const CourseFilters = ({ courses, categories }: CourseFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === 'all' ||
        course.category_id === selectedCategory

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' ||
        course.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [courses, searchQuery, selectedCategory, selectedDifficulty])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedDifficulty('all')
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all'

  return (
    <>
      {/* Search Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-900/50 via-background to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-400">
              <GraduationCap className="w-3 h-3 mr-1" />
              Academy
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Oromo Academy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Learn Oromo language, history, and culture through our comprehensive courses.
            </p>

            {/* Search */}
            <div className="mt-8 flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-card/80 backdrop-blur rounded-lg border border-border/50 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 text-left">
                      Difficulty
                    </label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2 text-left">
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
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
      <section className="py-8 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
              onClick={() => setSelectedCategory('all')}
            >
              All Courses
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {selectedCategory === 'all'
                  ? 'All Courses'
                  : categories.find(c => c.id === selectedCategory)?.name || 'Courses'}
              </h2>
              <p className="text-muted-foreground">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} available
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>

          {filteredCourses.length > 0 ? (
            <CourseGrid courses={filteredCourses} />
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
