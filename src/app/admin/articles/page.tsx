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

const mockArticles = [
  { id: '1', title: 'The Gadaa System: Ancient Democratic Governance', category: 'History', author: 'Bekele A.', status: 'published', views: 1250, featured: true },
  { id: '2', title: 'Irreecha: The Oromo Thanksgiving Festival', category: 'Culture', author: 'Chaltu M.', status: 'published', views: 980, featured: true },
  { id: '3', title: 'Traditional Oromo Music Instruments', category: 'Arts', author: 'Abdii T.', status: 'pending', views: 0, featured: false },
  { id: '4', title: 'Oromo Marriage Customs', category: 'Culture', author: 'Lelise D.', status: 'pending', views: 0, featured: false },
  { id: '5', title: 'Introduction to Qubee', category: 'Language', author: 'Gurmesa K.', status: 'published', views: 456, featured: false },
  { id: '6', title: 'Controversial Topic', category: 'History', author: 'Anonymous', status: 'rejected', views: 0, featured: false },
]

const statusColors = {
  published: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-slate-100 text-slate-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wiki Article Management</h1>
          <p className="text-slate-600">Review and moderate wiki articles</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search articles..."
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
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-slate-600">Title</th>
                  <th className="pb-3 font-medium text-slate-600">Category</th>
                  <th className="pb-3 font-medium text-slate-600">Author</th>
                  <th className="pb-3 font-medium text-slate-600">Status</th>
                  <th className="pb-3 font-medium text-slate-600">Views</th>
                  <th className="pb-3 font-medium text-slate-600">Featured</th>
                  <th className="pb-3 font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b last:border-0">
                    <td className="py-4 font-medium text-slate-900 max-w-xs truncate">{article.title}</td>
                    <td className="py-4 text-slate-600">{article.category}</td>
                    <td className="py-4 text-slate-600">{article.author}</td>
                    <td className="py-4">
                      <Badge className={statusColors[article.status as keyof typeof statusColors]}>
                        {article.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-slate-600">{article.views.toLocaleString()}</td>
                    <td className="py-4">
                      {article.featured && <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>}
                    </td>
                    <td className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-green-600"><CheckCircle className="w-4 h-4 mr-2" />Approve</DropdownMenuItem>
                          <DropdownMenuItem className="text-yellow-600"><XCircle className="w-4 h-4 mr-2" />Reject</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
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
