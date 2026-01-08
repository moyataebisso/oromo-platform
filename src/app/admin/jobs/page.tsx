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

const mockJobs = [
  { id: '1', title: 'Software Engineer', company: 'Oromo Tech Solutions', location: 'Minneapolis, MN', type: 'full-time', status: 'active', applications: 23 },
  { id: '2', title: 'Community Coordinator', company: 'Oromo Community Center', location: 'Washington, DC', type: 'full-time', status: 'active', applications: 15 },
  { id: '3', title: 'Language Instructor', company: 'Cultural Heritage Foundation', location: 'Remote', type: 'part-time', status: 'pending', applications: 0 },
  { id: '4', title: 'Marketing Specialist', company: 'Oromia Business Network', location: 'Atlanta, GA', type: 'full-time', status: 'active', applications: 8 },
  { id: '5', title: 'Legal Intern', company: 'Oromo Legal Aid', location: 'New York, NY', type: 'internship', status: 'closed', applications: 45 },
]

const statusColors = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-slate-100 text-slate-700',
}

const typeColors = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  contract: 'bg-orange-100 text-orange-700',
  internship: 'bg-pink-100 text-pink-700',
}

export default function AdminJobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
          <p className="text-slate-600">Manage and moderate job listings</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search jobs..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-slate-600">Job Title</th>
                  <th className="pb-3 font-medium text-slate-600">Company</th>
                  <th className="pb-3 font-medium text-slate-600">Location</th>
                  <th className="pb-3 font-medium text-slate-600">Type</th>
                  <th className="pb-3 font-medium text-slate-600">Status</th>
                  <th className="pb-3 font-medium text-slate-600">Applications</th>
                  <th className="pb-3 font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0">
                    <td className="py-4 font-medium text-slate-900">{job.title}</td>
                    <td className="py-4 text-slate-600">{job.company}</td>
                    <td className="py-4 text-slate-600">{job.location}</td>
                    <td className="py-4">
                      <Badge className={typeColors[job.type as keyof typeof typeColors]}>
                        {job.type}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge className={statusColors[job.status as keyof typeof statusColors]}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-slate-600">{job.applications}</td>
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
                          <DropdownMenuItem className="text-yellow-600"><XCircle className="w-4 h-4 mr-2" />Close</DropdownMenuItem>
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
