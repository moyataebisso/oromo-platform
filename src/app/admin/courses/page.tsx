'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mockCourses = [
  { id: '1', title: 'Introduction to Afaan Oromoo', category: 'Language', difficulty: 'beginner', status: 'published', lessons: 12, enrollments: 234 },
  { id: '2', title: 'Oromo History: From Ancient Times', category: 'History', difficulty: 'intermediate', status: 'published', lessons: 8, enrollments: 156 },
  { id: '3', title: 'Advanced Grammar Structures', category: 'Language', difficulty: 'advanced', status: 'draft', lessons: 15, enrollments: 0 },
  { id: '4', title: 'Gadaa System Deep Dive', category: 'Culture', difficulty: 'advanced', status: 'pending', lessons: 10, enrollments: 0 },
  { id: '5', title: 'Business Oromo Communication', category: 'Business', difficulty: 'intermediate', status: 'published', lessons: 9, enrollments: 89 },
]

const statusColors = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-slate-100 text-slate-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-600">Manage and moderate course content</p>
        </div>
        <Button>Add Course</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-slate-600">Course</th>
                  <th className="pb-3 font-medium text-slate-600">Category</th>
                  <th className="pb-3 font-medium text-slate-600">Difficulty</th>
                  <th className="pb-3 font-medium text-slate-600">Status</th>
                  <th className="pb-3 font-medium text-slate-600">Lessons</th>
                  <th className="pb-3 font-medium text-slate-600">Enrollments</th>
                  <th className="pb-3 font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b last:border-0">
                    <td className="py-4">
                      <p className="font-medium text-slate-900">{course.title}</p>
                    </td>
                    <td className="py-4 text-slate-600">{course.category}</td>
                    <td className="py-4">
                      <Badge className={difficultyColors[course.difficulty as keyof typeof difficultyColors]}>
                        {course.difficulty}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge className={statusColors[course.status as keyof typeof statusColors]}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-slate-600">{course.lessons}</td>
                    <td className="py-4 text-slate-600">{course.enrollments}</td>
                    <td className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Course
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-yellow-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
