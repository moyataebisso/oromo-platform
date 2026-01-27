'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  getAllComments,
  getCommentStatusCounts,
  resolveComment,
  markAsSpam,
  deleteComment,
} from '@/lib/supabase/page-comments'
import {
  PageComment,
  CommentType,
  CommentStatus,
  COMMENT_TYPE_CONFIG,
  COMMENT_STATUS_CONFIG,
} from '@/types/page-comment'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

export default function AdminFeedbackPage() {
  const [comments, setComments] = useState<PageComment[]>([])
  const [counts, setCounts] = useState<Record<CommentStatus, number>>({
    active: 0,
    resolved: 0,
    hidden: 0,
    spam: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<CommentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [commentsData, countsData] = await Promise.all([
        getAllComments({
          comment_type: typeFilter === 'all' ? undefined : typeFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
          limit: 100,
        }),
        getCommentStatusCounts(),
      ])
      setComments(commentsData)
      setCounts(countsData)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast.error('Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }, [typeFilter, statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleResolve = async (id: string) => {
    try {
      const result = await resolveComment(id)
      if (result.success) {
        toast.success('Comment marked as resolved')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to resolve')
      }
    } catch {
      toast.error('Failed to resolve')
    }
  }

  const handleMarkSpam = async (id: string) => {
    try {
      const result = await markAsSpam(id)
      if (result.success) {
        toast.success('Marked as spam')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to mark as spam')
      }
    } catch {
      toast.error('Failed to mark as spam')
    }
  }

  const handleHide = async (id: string) => {
    try {
      const result = await deleteComment(id)
      if (result.success) {
        toast.success('Comment hidden')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to hide')
      }
    } catch {
      toast.error('Failed to hide')
    }
  }

  // Filter by search query
  const filteredComments = comments.filter((comment) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      comment.content.toLowerCase().includes(query) ||
      comment.page_path.toLowerCase().includes(query) ||
      (comment.display_name?.toLowerCase() || '').includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feedback Management</h1>
          <p className="text-muted-foreground">
            Manage user feedback and comments from all pages
          </p>
        </div>
        <Button onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{counts.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{counts.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{counts.hidden}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spam</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{counts.spam}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by content, page, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as CommentType | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
            <SelectItem value="suggestion">Suggestions</SelectItem>
            <SelectItem value="question">Questions</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as CommentStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comments Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No feedback found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment) => {
                  const typeConfig = COMMENT_TYPE_CONFIG[comment.comment_type]
                  const statusConfig = COMMENT_STATUS_CONFIG[comment.status]

                  return (
                    <TableRow key={comment.id}>
                      <TableCell>
                        <Badge
                          className={cn(
                            'text-xs',
                            typeConfig.bgClass,
                            'text-white border-0'
                          )}
                        >
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="line-clamp-2 text-sm">{comment.content}</p>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={comment.page_path}
                          target="_blank"
                          className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                        >
                          <span className="max-w-[150px] truncate">
                            {comment.page_path}
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {comment.display_name || 'Anonymous'}
                          </span>
                          {!comment.user_id && (
                            <Badge variant="outline" className="text-[10px]">
                              Guest
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            comment.status === 'active' && 'border-green-500 text-green-500',
                            comment.status === 'resolved' && 'border-blue-500 text-blue-500',
                            comment.status === 'hidden' && 'border-gray-500 text-gray-500',
                            comment.status === 'spam' && 'border-red-500 text-red-500'
                          )}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/feedback/${comment.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {comment.status === 'active' && (
                              <DropdownMenuItem
                                onClick={() => handleResolve(comment.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                                Mark Resolved
                              </DropdownMenuItem>
                            )}
                            {comment.status !== 'hidden' && (
                              <DropdownMenuItem
                                onClick={() => handleHide(comment.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                                Hide
                              </DropdownMenuItem>
                            )}
                            {comment.status !== 'spam' && (
                              <DropdownMenuItem
                                onClick={() => handleMarkSpam(comment.id)}
                                className="text-red-500"
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Mark as Spam
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
