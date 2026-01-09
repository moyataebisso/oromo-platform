'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Users,
  Filter
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
import { eventCategoryLabels, eventCategoryColors } from '@/types/events'

// Sample events data
const sampleEvents = [
  {
    id: '1',
    title: 'Oromo Cultural Festival 2026',
    category: 'cultural',
    city: 'Washington',
    state: 'DC',
    start_date: '2026-03-15',
    is_virtual: false,
    is_featured: true,
    is_approved: true,
    attendee_count: 458,
    organizer_name: 'Oromo Community Association',
  },
  {
    id: '2',
    title: 'Afaan Oromoo Language Workshop',
    category: 'educational',
    city: null,
    state: null,
    start_date: '2026-01-20',
    is_virtual: true,
    is_featured: true,
    is_approved: true,
    attendee_count: 124,
    organizer_name: 'Oromo Language Institute',
  },
  {
    id: '3',
    title: 'Oromo Youth Sports Tournament',
    category: 'sports',
    city: 'Minneapolis',
    state: 'MN',
    start_date: '2026-02-08',
    is_virtual: false,
    is_featured: false,
    is_approved: true,
    attendee_count: 89,
    organizer_name: 'Oromo Youth Sports Association',
  },
  {
    id: '4',
    title: 'Oromo Business Networking Event',
    category: 'professional',
    city: 'Atlanta',
    state: 'GA',
    start_date: '2026-01-25',
    is_virtual: false,
    is_featured: true,
    is_approved: false,
    attendee_count: 156,
    organizer_name: 'Oromo Business Network',
  },
  {
    id: '5',
    title: 'Community Prayer & Celebration',
    category: 'religious',
    city: 'Columbus',
    state: 'OH',
    start_date: '2026-01-12',
    is_virtual: false,
    is_featured: false,
    is_approved: true,
    attendee_count: 67,
    organizer_name: 'Oromo Faith Community',
  },
]

export default function AdminEventsPage() {
  const [events, setEvents] = useState(sampleEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all')

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'approved' && event.is_approved) ||
      (filterStatus === 'pending' && !event.is_approved)
    return matchesSearch && matchesStatus
  })

  const handleToggleApproved = (id: string) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, is_approved: !event.is_approved } : event
    ))
  }

  const handleToggleFeatured = (id: string) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, is_featured: !event.is_featured } : event
    ))
  }

  const handleDelete = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const pendingCount = events.filter(e => !e.is_approved).length
  const featuredCount = events.filter(e => e.is_featured).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground">Manage community events and submissions</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{events.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
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
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {events.reduce((sum, e) => sum + e.attendee_count, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total RSVPs</p>
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
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('approved')}
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                <Badge className="mr-1 bg-amber-500/20 text-amber-400">{pendingCount}</Badge>
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Event</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>RSVPs</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} className="border-border/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.organizer_name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${eventCategoryColors[event.category as keyof typeof eventCategoryColors]}`}>
                      {eventCategoryLabels[event.category as keyof typeof eventCategoryLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.is_virtual ? (
                      <Badge variant="outline">Virtual</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {event.city}, {event.state}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(event.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {event.attendee_count}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={event.is_featured}
                      onCheckedChange={() => handleToggleFeatured(event.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={event.is_approved}
                      onCheckedChange={() => handleToggleApproved(event.id)}
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
                          <Link href={`/events/${event.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400"
                          onClick={() => handleDelete(event.id)}
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
