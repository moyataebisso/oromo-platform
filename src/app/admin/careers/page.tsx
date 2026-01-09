'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Edit, Trash2, Plus, Briefcase, TrendingUp, DollarSign, GraduationCap, Eye, EyeOff } from 'lucide-react'
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

interface Career {
  id: string
  title: string
  slug: string
  category: string
  description: string
  salary_min: number
  salary_max: number
  job_outlook: string
  education_required: string
  skills_needed: string
  is_published: boolean
  created_at: string
}

const categoryColors: Record<string, string> = {
  technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  healthcare: 'bg-green-500/10 text-green-400 border-green-500/20',
  business: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  education: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  engineering: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  creative: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  legal: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
}

// Mock data - in production, fetch from Supabase
const mockCareers: Career[] = [
  {
    id: '1',
    title: 'Software Developer',
    slug: 'software-developer',
    category: 'technology',
    description: 'Design, develop, and maintain software applications.',
    salary_min: 70000,
    salary_max: 150000,
    job_outlook: '+22%',
    education_required: "Bachelor's degree in Computer Science or related field",
    skills_needed: 'JavaScript, Python, Problem Solving, Communication',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Registered Nurse',
    slug: 'registered-nurse',
    category: 'healthcare',
    description: 'Provide and coordinate patient care in various healthcare settings.',
    salary_min: 60000,
    salary_max: 110000,
    job_outlook: '+6%',
    education_required: 'BSN or Associate Degree in Nursing',
    skills_needed: 'Patient Care, Critical Thinking, Communication, Empathy',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Financial Analyst',
    slug: 'financial-analyst',
    category: 'business',
    description: 'Analyze financial data and provide investment recommendations.',
    salary_min: 65000,
    salary_max: 120000,
    job_outlook: '+9%',
    education_required: "Bachelor's degree in Finance, Economics, or Accounting",
    skills_needed: 'Excel, Financial Modeling, Analysis, Communication',
    is_published: false,
    created_at: new Date().toISOString(),
  },
]

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'creative', label: 'Creative' },
  { value: 'legal', label: 'Legal' },
]

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>(mockCareers)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'technology',
    description: '',
    salary_min: 0,
    salary_max: 0,
    job_outlook: '',
    education_required: '',
    skills_needed: '',
    is_published: true,
  })

  const filteredCareers = careers.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddCareer = async () => {
    setIsSaving(true)
    // In production, this would be a Supabase insert
    const newCareer: Career = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
    }
    setCareers([newCareer, ...careers])
    setIsAddDialogOpen(false)
    resetForm()
    setIsSaving(false)
  }

  const handleEditCareer = async () => {
    if (!selectedCareer) return
    setIsSaving(true)
    // In production, this would be a Supabase update
    setCareers(careers.map(c =>
      c.id === selectedCareer.id ? { ...c, ...formData } : c
    ))
    setIsEditDialogOpen(false)
    resetForm()
    setIsSaving(false)
  }

  const handleDeleteCareer = async () => {
    if (!selectedCareer) return
    // In production, this would be a Supabase delete
    setCareers(careers.filter(c => c.id !== selectedCareer.id))
    setIsDeleteDialogOpen(false)
    setSelectedCareer(null)
  }

  const togglePublish = async (career: Career) => {
    // In production, this would be a Supabase update
    setCareers(careers.map(c =>
      c.id === career.id ? { ...c, is_published: !c.is_published } : c
    ))
  }

  const openEditDialog = (career: Career) => {
    setSelectedCareer(career)
    setFormData({
      title: career.title,
      slug: career.slug,
      category: career.category,
      description: career.description,
      salary_min: career.salary_min,
      salary_max: career.salary_max,
      job_outlook: career.job_outlook,
      education_required: career.education_required,
      skills_needed: career.skills_needed,
      is_published: career.is_published,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (career: Career) => {
    setSelectedCareer(career)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'technology',
      description: '',
      salary_min: 0,
      salary_max: 0,
      job_outlook: '',
      education_required: '',
      skills_needed: '',
      is_published: true,
    })
    setSelectedCareer(null)
  }

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'Not specified'
    const formatK = (n: number) => `$${Math.round(n / 1000)}K`
    return `${formatK(min)} - ${formatK(max)}`
  }

  const publishedCount = careers.filter(c => c.is_published).length
  const techCount = careers.filter(c => c.category === 'technology').length
  const healthCount = careers.filter(c => c.category === 'healthcare').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Careers Management</h1>
          <p className="text-muted-foreground">Manage career profiles and information</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Career
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{careers.length}</p>
                <p className="text-sm text-muted-foreground">Total Careers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{techCount}</p>
                <p className="text-sm text-muted-foreground">Tech Careers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{healthCount}</p>
                <p className="text-sm text-muted-foreground">Healthcare</p>
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
                placeholder="Search careers..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Careers Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Careers ({filteredCareers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Career</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCareers.map((career) => (
                <TableRow key={career.id} className="border-border/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{career.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{career.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border capitalize ${categoryColors[career.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                      {career.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-emerald-400">
                    {formatSalary(career.salary_min, career.salary_max)}
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-400">{career.job_outlook}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={career.is_published ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => togglePublish(career)}
                    >
                      {career.is_published ? 'Published' : 'Draft'}
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
                        <DropdownMenuItem onClick={() => openEditDialog(career)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublish(career)}>
                          {career.is_published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(career)} className="text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCareers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No careers found
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Career' : 'Add New Career'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'Update career information.' : 'Add a new career profile.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Career Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                  })}
                  placeholder="Software Developer"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
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
                placeholder="Brief description of the career..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salary_min">Min Salary ($)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min || ''}
                  onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) || 0 })}
                  placeholder="50000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salary_max">Max Salary ($)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max || ''}
                  onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) || 0 })}
                  placeholder="100000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job_outlook">Job Outlook</Label>
                <Input
                  id="job_outlook"
                  value={formData.job_outlook}
                  onChange={(e) => setFormData({ ...formData, job_outlook: e.target.value })}
                  placeholder="+15%"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="education_required">Education Required</Label>
              <Textarea
                id="education_required"
                value={formData.education_required}
                onChange={(e) => setFormData({ ...formData, education_required: e.target.value })}
                placeholder="Bachelor's degree in relevant field..."
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills_needed">Skills Needed (comma-separated)</Label>
              <Input
                id="skills_needed"
                value={formData.skills_needed}
                onChange={(e) => setFormData({ ...formData, skills_needed: e.target.value })}
                placeholder="JavaScript, Python, Communication"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
              resetForm()
            }}>Cancel</Button>
            <Button
              onClick={isEditDialogOpen ? handleEditCareer : handleAddCareer}
              disabled={!formData.title || isSaving}
            >
              {isSaving ? 'Saving...' : isEditDialogOpen ? 'Save Changes' : 'Create Career'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Career</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedCareer?.title}&quot;? This will also delete all associated interview questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCareer} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
