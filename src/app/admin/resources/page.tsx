'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Link2,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  ExternalLink,
  GripVertical
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { resourceCategoryLabels, resourceCategoryColors } from '@/types/resources'

// Sample resources data
const sampleResources = [
  {
    id: '1',
    name: 'Oromia Online',
    description: 'Comprehensive Oromo language learning platform',
    url: 'https://oromiaonline.org',
    category: 'education',
    is_featured: true,
    is_approved: true,
    order_index: 1,
  },
  {
    id: '2',
    name: 'Oromo Community Association',
    description: 'National organization for Oromo community advocacy',
    url: 'https://oromocommunity.org',
    category: 'organization',
    is_featured: true,
    is_approved: true,
    order_index: 2,
  },
  {
    id: '3',
    name: 'Oromo Sports Federation',
    description: 'Promoting sports among Oromo youth worldwide',
    url: 'https://oromosports.org',
    category: 'sports',
    is_featured: false,
    is_approved: true,
    order_index: 3,
  },
  {
    id: '4',
    name: 'ONN - Oromo News Network',
    description: 'Breaking news and updates from the Oromo community',
    url: 'https://onn.news',
    category: 'news',
    is_featured: true,
    is_approved: true,
    order_index: 4,
  },
  {
    id: '5',
    name: 'Oromo Health Initiative',
    description: 'Health resources and support for the community',
    url: 'https://oromohealth.org',
    category: 'health',
    is_featured: false,
    is_approved: false,
    order_index: 5,
  },
  {
    id: '6',
    name: 'Oromo Business Directory',
    description: 'Directory of Oromo-owned businesses',
    url: 'https://oromobusiness.com',
    category: 'business',
    is_featured: false,
    is_approved: false,
    order_index: 6,
  },
]

export default function AdminResourcesPage() {
  const [resources, setResources] = useState(sampleResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', 'education', 'organization', 'sports', 'news', 'health', 'business', 'government', 'legal', 'other']

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleToggleApproved = (id: string) => {
    setResources(resources.map(resource =>
      resource.id === id ? { ...resource, is_approved: !resource.is_approved } : resource
    ))
  }

  const handleToggleFeatured = (id: string) => {
    setResources(resources.map(resource =>
      resource.id === id ? { ...resource, is_featured: !resource.is_featured } : resource
    ))
  }

  const handleDelete = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id))
  }

  const pendingCount = resources.filter(r => !r.is_approved).length
  const featuredCount = resources.filter(r => r.is_featured).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources Management</h1>
          <p className="text-muted-foreground">Manage trusted community resources and links</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/resources/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                <p className="text-sm text-muted-foreground">Total Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{resources.filter(r => r.is_approved).length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{featuredCount}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 5).map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All' : resourceCategoryLabels[category as keyof typeof resourceCategoryLabels] || category}
                </Button>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    More...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.slice(5).map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className="capitalize"
                    >
                      {resourceCategoryLabels[category as keyof typeof resourceCategoryLabels] || category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-8"></TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id} className="border-border/50">
                  <TableCell>
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{resource.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{resource.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${resourceCategoryColors[resource.category as keyof typeof resourceCategoryColors]}`}>
                      {resourceCategoryLabels[resource.category as keyof typeof resourceCategoryLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {new URL(resource.url).hostname}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={resource.is_featured}
                      onCheckedChange={() => handleToggleFeatured(resource.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={resource.is_approved}
                      onCheckedChange={() => handleToggleApproved(resource.id)}
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
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-2" />
                            Visit
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400"
                          onClick={() => handleDelete(resource.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
