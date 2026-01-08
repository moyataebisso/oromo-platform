'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
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
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Oromo Academy
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Learn Oromo language, history, and culture through our comprehensive courses.
            </p>

            {/* Search */}
            <div className="mt-6 flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                className={showFilters ? 'bg-slate-100' : ''}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
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
                    <label className="text-sm font-medium text-slate-700 block mb-2">
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
      <section className="py-8 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
              className="cursor-pointer hover:bg-slate-200 px-4 py-2 transition-colors"
              onClick={() => setSelectedCategory('all')}
            >
              All Courses
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? 'secondary' : 'outline'}
                className="cursor-pointer hover:bg-slate-100 px-4 py-2 transition-colors"
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
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedCategory === 'all'
                  ? 'All Courses'
                  : categories.find(c => c.id === selectedCategory)?.name || 'Courses'}
              </h2>
              <p className="text-slate-600">
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
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No courses found</h3>
              <p className="text-slate-600 mb-4">
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
