'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Eye, Trash2, CheckCircle, XCircle, MessageSquare, Heart, Pin, EyeOff, Users, Clock, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface Post {
  id: string
  content: string
  author: {
    name: string
    avatar: string | null
  }
  likes: number
  comments: number
  status: 'active' | 'hidden' | 'pending'
  is_pinned: boolean
  is_reported: boolean
  created_at: string
}

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string | null
  }
  post_title: string
  status: 'active' | 'hidden' | 'pending'
  is_reported: boolean
  created_at: string
}

const initialPosts: Post[] = []

const initialComments: Comment[] = []

const statusColors = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  hidden: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('posts')

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter ||
                         (statusFilter === 'reported' && post.is_reported)
    return matchesSearch && matchesStatus
  })

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter ||
                         (statusFilter === 'reported' && comment.is_reported)
    return matchesSearch && matchesStatus
  })

  const handleApprovePost = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, status: 'active' as const, is_reported: false } : post
    ))
  }

  const handleHidePost = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, status: 'hidden' as const } : post
    ))
  }

  const handleTogglePin = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, is_pinned: !post.is_pinned } : post
    ))
  }

  const handleDeletePost = () => {
    if (!selectedPost) return
    setPosts(posts.filter(post => post.id !== selectedPost.id))
    setIsDeleteDialogOpen(false)
    setSelectedPost(null)
  }

  const handleApproveComment = (id: string) => {
    setComments(comments.map(comment =>
      comment.id === id ? { ...comment, status: 'active' as const, is_reported: false } : comment
    ))
  }

  const handleHideComment = (id: string) => {
    setComments(comments.map(comment =>
      comment.id === id ? { ...comment, status: 'hidden' as const } : comment
    ))
  }

  const handleDeleteComment = () => {
    if (!selectedComment) return
    setComments(comments.filter(comment => comment.id !== selectedComment.id))
    setIsDeleteDialogOpen(false)
    setSelectedComment(null)
  }

  const openDeletePostDialog = (post: Post) => {
    setSelectedPost(post)
    setSelectedComment(null)
    setIsDeleteDialogOpen(true)
  }

  const openDeleteCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setSelectedPost(null)
    setIsDeleteDialogOpen(true)
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

  const handleSelectAllPosts = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredPosts.map(p => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectAllComments = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredComments.map(c => c.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleBulkDelete = () => {
    if (activeTab === 'posts') {
      setPosts(posts.filter(post => !selectedIds.has(post.id)))
    } else {
      setComments(comments.filter(comment => !selectedIds.has(comment.id)))
    }
    setSelectedIds(new Set())
    setIsBulkDeleteDialogOpen(false)
  }

  const isAllPostsSelected = filteredPosts.length > 0 && filteredPosts.every(p => selectedIds.has(p.id))
  const isAllCommentsSelected = filteredComments.length > 0 && filteredComments.every(c => selectedIds.has(c.id))
  const hasSelection = selectedIds.size > 0

  const activePostsCount = posts.filter(p => p.status === 'active').length
  const pendingPostsCount = posts.filter(p => p.status === 'pending').length
  const reportedCount = posts.filter(p => p.is_reported).length + comments.filter(c => c.is_reported).length
  const pinnedCount = posts.filter(p => p.is_pinned).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Moderation</h1>
          <p className="text-muted-foreground">Manage posts and comments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
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
                <p className="text-2xl font-bold text-foreground">{pendingPostsCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                <Flag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{reportedCount}</p>
                <p className="text-sm text-muted-foreground">Reported</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Pin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pinnedCount}</p>
                <p className="text-sm text-muted-foreground">Pinned</p>
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
                placeholder="Search content..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'reported', 'hidden'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status === 'reported' && reportedCount > 0 && (
                    <Badge className="mr-1 bg-red-500/20 text-red-400">{reportedCount}</Badge>
                  )}
                  {status === 'pending' && pendingPostsCount > 0 && (
                    <Badge className="mr-1 bg-amber-500/20 text-amber-400">{pendingPostsCount}</Badge>
                  )}
                  {status === 'all' ? 'All' : status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Posts and Comments */}
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setSelectedIds(new Set()); }}>
        <TabsList>
          <TabsTrigger value="posts">Posts ({filteredPosts.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({filteredComments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Posts</CardTitle>
              {hasSelection && activeTab === 'posts' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedIds.size})
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllPostsSelected}
                        onCheckedChange={(checked) => handleSelectAllPosts(checked === true)}
                        aria-label="Select all posts"
                      />
                    </TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="border-border/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(post.id)}
                          onCheckedChange={() => handleToggleSelect(post.id)}
                          aria-label={`Select post by ${post.author.name}`}
                        />
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="flex items-start gap-2">
                          {post.is_pinned && <Pin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />}
                          {post.is_reported && <Flag className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />}
                          <p className="text-foreground line-clamp-2">{post.content}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{post.author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-muted-foreground text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" /> {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" /> {post.comments}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${statusColors[post.status]}`}>
                          {post.status}
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
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {post.status !== 'active' && (
                              <DropdownMenuItem onClick={() => handleApprovePost(post.id)} className="text-emerald-400">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'hidden' && (
                              <DropdownMenuItem onClick={() => handleHidePost(post.id)} className="text-amber-400">
                                <EyeOff className="w-4 h-4 mr-2" />
                                Hide
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleTogglePin(post.id)} className="text-purple-400">
                              <Pin className="w-4 h-4 mr-2" />
                              {post.is_pinned ? 'Unpin' : 'Pin'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeletePostDialog(post)} className="text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No posts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comments</CardTitle>
              {hasSelection && activeTab === 'comments' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedIds.size})
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllCommentsSelected}
                        onCheckedChange={(checked) => handleSelectAllComments(checked === true)}
                        aria-label="Select all comments"
                      />
                    </TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map((comment) => (
                    <TableRow key={comment.id} className="border-border/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(comment.id)}
                          onCheckedChange={() => handleToggleSelect(comment.id)}
                          aria-label={`Select comment by ${comment.author.name}`}
                        />
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="flex items-start gap-2">
                          {comment.is_reported && <Flag className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />}
                          <p className="text-foreground line-clamp-2">{comment.content}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                              {comment.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{comment.author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {comment.post_title}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${statusColors[comment.status]}`}>
                          {comment.status}
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
                            {comment.status !== 'active' && (
                              <DropdownMenuItem onClick={() => handleApproveComment(comment.id)} className="text-emerald-400">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {comment.status !== 'hidden' && (
                              <DropdownMenuItem onClick={() => handleHideComment(comment.id)} className="text-amber-400">
                                <EyeOff className="w-4 h-4 mr-2" />
                                Hide
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteCommentDialog(comment)} className="text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredComments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No comments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedPost ? 'Post' : 'Comment'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {selectedPost ? 'post' : 'comment'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={selectedPost ? handleDeletePost : handleDeleteComment}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected {activeTab === 'posts' ? 'Posts' : 'Comments'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected {activeTab === 'posts' ? (selectedIds.size === 1 ? 'post' : 'posts') : (selectedIds.size === 1 ? 'comment' : 'comments')}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete {selectedIds.size} {activeTab === 'posts' ? (selectedIds.size === 1 ? 'Post' : 'Posts') : (selectedIds.size === 1 ? 'Comment' : 'Comments')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
