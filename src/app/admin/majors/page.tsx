'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Edit, Trash2, Plus, GraduationCap, TrendingUp, DollarSign, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface Major {
  id: string
  title: string
  slug: string
  category: 'stem' | 'business' | 'healthcare' | 'arts' | 'law' | 'social'
  description: string
  avg_salary: string
  growth_rate: string
  job_openings: string
  is_published: boolean
  created_at: string
}

const categoryColors = {
  stem: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  business: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  healthcare: 'bg-red-500/10 text-red-400 border-red-500/20',
  arts: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  law: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  social: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

// Mock data
const mockMajors: Major[] = [
  {
    id: '1',
    title: 'Computer Science',
    slug: 'computer-science',
    category: 'stem',
    description: 'Learn programming, algorithms, and software development.',
    avg_salary: '$89,000',
    growth_rate: '+22%',
    job_openings: '162,900',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Nursing',
    slug: 'nursing',
    category: 'healthcare',
    description: 'Prepare for a career in patient care and health promotion.',
    avg_salary: '$77,600',
    growth_rate: '+6%',
    job_openings: '203,200',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Business Administration',
    slug: 'business-administration',
    category: 'business',
    description: 'Develop leadership and management skills.',
    avg_salary: '$72,000',
    growth_rate: '+8%',
    job_openings: '148,500',
    is_published: true,
    created_at: new Date().toISOString(),
  },
]

export default function AdminMajorsPage() {
  const [majors, setMajors] = useState<Major[]>(mockMajors)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'stem' as Major['category'],
    description: '',
    avg_salary: '',
    growth_rate: '',
    job_openings: '',
    is_published: true,
  })

  const filteredMajors = majors.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddMajor = async () => {
    setIsSaving(true)
    const newMajor: Major = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
    }
    setMajors([newMajor, ...majors])
    setIsAddDialogOpen(false)
    resetForm()
    setIsSaving(false)
  }

  const handleEditMajor = async () => {
    if (!selectedMajor) return
    setIsSaving(true)
    setMajors(majors.map(m =>
      m.id === selectedMajor.id ? { ...m, ...formData } : m
    ))
    setIsEditDialogOpen(false)
    resetForm()
    setIsSaving(false)
  }

  const handleDeleteMajor = async () => {
    if (!selectedMajor) return
    setMajors(majors.filter(m => m.id !== selectedMajor.id))
    setIsDeleteDialogOpen(false)
    setSelectedMajor(null)
  }

  const openEditDialog = (major: Major) => {
    setSelectedMajor(major)
    setFormData({
      title: major.title,
      slug: major.slug,
      category: major.category,
      description: major.description,
      avg_salary: major.avg_salary,
      growth_rate: major.growth_rate,
      job_openings: major.job_openings,
      is_published: major.is_published,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (major: Major) => {
    setSelectedMajor(major)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'stem',
      description: '',
      avg_salary: '',
      growth_rate: '',
      job_openings: '',
      is_published: true,
    })
    setSelectedMajor(null)
  }

  const stemCount = majors.filter(m => m.category === 'stem').length
  const healthcareCount = majors.filter(m => m.category === 'healthcare').length
  const businessCount = majors.filter(m => m.category === 'business').length
  const publishedCount = majors.filter(m => m.is_published).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Majors Guide</h1>
          <p className="text-muted-foreground">Manage college major information</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Major
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{majors.length}</p>
                <p className="text-sm text-muted-foreground">Total Majors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stemCount}</p>
                <p className="text-sm text-muted-foreground">STEM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{healthcareCount + businessCount}</p>
                <p className="text-sm text-muted-foreground">Professional</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published</p>
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
                placeholder="Search majors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="stem">STEM</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="arts">Arts & Humanities</SelectItem>
                <SelectItem value="law">Law & Policy</SelectItem>
                <SelectItem value="social">Social Sciences</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Majors Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Majors ({filteredMajors.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Major</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Avg. Salary</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMajors.map((major) => (
                <TableRow key={major.id} className="border-border/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{major.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{major.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${categoryColors[major.category]}`}>
                      {major.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-emerald-400">
                    {major.avg_salary}
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-400">{major.growth_rate}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={major.is_published ? 'default' : 'secondary'}>
                      {major.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(major)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(major)} className="text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMajors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No majors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false)
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Major' : 'Add New Major'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'Update major information.' : 'Add a new major to the guide.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Major Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                  })}
                  placeholder="Computer Science"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v as Major['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="law">Law & Policy</SelectItem>
                    <SelectItem value="social">Social Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the major..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="avg_salary">Avg. Salary</Label>
                <Input
                  id="avg_salary"
                  value={formData.avg_salary}
                  onChange={(e) => setFormData({ ...formData, avg_salary: e.target.value })}
                  placeholder="$75,000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="growth_rate">Growth Rate</Label>
                <Input
                  id="growth_rate"
                  value={formData.growth_rate}
                  onChange={(e) => setFormData({ ...formData, growth_rate: e.target.value })}
                  placeholder="+10%"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job_openings">Job Openings</Label>
                <Input
                  id="job_openings"
                  value={formData.job_openings}
                  onChange={(e) => setFormData({ ...formData, job_openings: e.target.value })}
                  placeholder="50,000"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
              resetForm()
            }}>Cancel</Button>
            <Button
              onClick={isEditDialogOpen ? handleEditMajor : handleAddMajor}
              disabled={!formData.title || isSaving}
            >
              {isSaving ? 'Saving...' : isEditDialogOpen ? 'Save Changes' : 'Create Major'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Major</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedMajor?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMajor} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
