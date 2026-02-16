'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, Plus, GraduationCap, BookOpen, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  category_id: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  created_at: string
  category?: { id: string; name: string } | null
  lessons_count?: number
}

interface Category {
  id: string
  name: string
  slug: string
}

const difficultyColors = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    is_published: false,
  })

  const supabase = createClient()

  // Fetch courses and categories
  const fetchData = useCallback(async () => {
    setIsLoading(true)

    // Fetch courses with category
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: coursesData } = await (supabase
      .from('courses')
      .select('*, category:course_categories(*)')
      .order('created_at', { ascending: false }) as any)

    // Fetch categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: categoriesData } = await (supabase
      .from('course_categories')
      .select('*')
      .order('name') as any)

    // Fetch lesson counts for each course
    if (coursesData) {
      const coursesWithCounts = await Promise.all(
        (coursesData as Course[]).map(async (course: Course) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { count } = await (supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id) as any)
          return { ...course, lessons_count: count || 0 }
        })
      )
      setCourses(coursesWithCounts as Course[])
    }

    if (categoriesData) {
      setCategories(categoriesData)
    }

    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && course.is_published) ||
      (statusFilter === 'draft' && !course.is_published)
    return matchesSearch && matchesStatus
  })

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('courses') as any)
      .update({ is_published: !currentStatus })
      .eq('id', id)

    if (!error) {
      setCourses(courses.map(course =>
        course.id === id ? { ...course, is_published: !currentStatus } : course
      ))
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleAddCourse = async () => {
    setIsSaving(true)

    const slug = formData.slug || generateSlug(formData.title)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('courses') as any)
      .insert({
        title: formData.title,
        slug,
        description: formData.description || null,
        category_id: formData.category_id || null,
        difficulty: formData.difficulty,
        is_published: formData.is_published,
      })
      .select('*, category:categories(*)')
      .single()

    if (!error && data) {
      setCourses([{ ...data, lessons_count: 0 }, ...courses])
      setIsAddDialogOpen(false)
      resetForm()
    }

    setIsSaving(false)
  }

  const handleEditCourse = async () => {
    if (!selectedCourse) return
    setIsSaving(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('courses') as any)
      .update({
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        category_id: formData.category_id || null,
        difficulty: formData.difficulty,
        is_published: formData.is_published,
      })
      .eq('id', selectedCourse.id)
      .select('*, category:categories(*)')
      .single()

    if (!error && data) {
      setCourses(courses.map(course =>
        course.id === selectedCourse.id ? { ...data, lessons_count: course.lessons_count } : course
      ))
      setIsEditDialogOpen(false)
      resetForm()
    }

    setIsSaving(false)
  }

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('courses') as any)
      .delete()
      .eq('id', selectedCourse.id)

    if (!error) {
      setCourses(courses.filter(course => course.id !== selectedCourse.id))
      setIsDeleteDialogOpen(false)
      setSelectedCourse(null)
    }
  }

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredCourses.length && filteredCourses.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCourses.map(c => c.id)))
    }
  }

  const isAllSelected = filteredCourses.length > 0 && selectedIds.size === filteredCourses.length
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredCourses.length

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return

    const idsArray = Array.from(selectedIds)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('courses') as any)
      .delete()
      .in('id', idsArray)

    if (!error) {
      setSelectedIds(new Set())
      setIsBulkDeleteDialogOpen(false)
      await fetchData()
    }
  }

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course)
    setFormData({
      title: course.title,
      slug: course.slug,
      description: course.description || '',
      category_id: course.category_id || '',
      difficulty: course.difficulty,
      is_published: course.is_published,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      category_id: '',
      difficulty: 'beginner',
      is_published: false,
    })
    setSelectedCourse(null)
  }

  const publishedCount = courses.filter(c => c.is_published).length
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons_count || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground">Manage and moderate course content</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Courses ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading courses...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                      onCheckedChange={handleToggleSelectAll}
                      aria-label="Select all courses"
                    />
                  </TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="border-border/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(course.id)}
                        onCheckedChange={() => handleToggleSelect(course.id)}
                        aria-label={`Select ${course.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{course.title}</p>
                        <p className="text-sm text-muted-foreground">/{course.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.category?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border ${difficultyColors[course.difficulty]}`}>
                        {course.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.lessons_count || 0}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={course.is_published}
                        onCheckedChange={() => handleTogglePublished(course.id, course.is_published)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/academy/${course.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Course
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(course)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-400"
                            onClick={() => openDeleteDialog(course)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Create a new course for the academy.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Introduction to Afaan Oromoo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="introduction-to-afaan-oromoo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v as 'beginner' | 'intermediate' | 'advanced' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCourse} disabled={!formData.title || isSaving}>
              {isSaving ? 'Creating...' : 'Create Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v as 'beginner' | 'intermediate' | 'advanced' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="edit-published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="edit-published">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCourse} disabled={!formData.title || isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedCourse?.title}&quot;? This action cannot be undone and will also delete all lessons associated with this course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Courses</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected course{selectedIds.size !== 1 ? 's' : ''}? This action cannot be undone and will also delete all lessons associated with these courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-600">
              Delete {selectedIds.size} Course{selectedIds.size !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
