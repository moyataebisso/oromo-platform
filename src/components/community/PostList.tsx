'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PostCard } from './PostCard'
import { SortControls } from './SortControls'
import { ReportDialog } from './ReportDialog'
import type { ForumPost, SortOption } from '@/types/community'

interface PostListProps {
  posts: ForumPost[]
  total: number
  currentPage: number
  pageSize: number
  sort: SortOption
  baseUrl: string
  categorySlug?: string
  showCategory?: boolean
  isModerator?: boolean
  isLoggedIn?: boolean
}

export function PostList({
  posts,
  total,
  currentPage,
  pageSize,
  sort,
  baseUrl,
  categorySlug,
  showCategory = true,
  isModerator = false,
  isLoggedIn = false
}: PostListProps) {
  const router = useRouter()
  const [reportPostId, setReportPostId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (sort !== 'hot') params.set('sort', sort)
    if (page > 1) params.set('page', page.toString())
    const queryString = params.toString()
    router.push(`${baseUrl}${queryString ? `?${queryString}` : ''}`)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' })
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with sort and create button */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SortControls currentSort={sort} baseUrl={baseUrl} />
        <Button asChild>
          <Link href={categorySlug ? `/community/new?category=${categorySlug}` : '/community/new'}>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to start a conversation in this community!
            </p>
            {isLoggedIn && (
              <Button asChild>
                <Link href="/community/new">Create the first post</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              showCategory={showCategory}
              isModerator={isModerator}
              onReport={setReportPostId}
              onDelete={isModerator ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Report dialog */}
      {reportPostId && (
        <ReportDialog
          type="post"
          id={reportPostId}
          open={!!reportPostId}
          onClose={() => setReportPostId(null)}
        />
      )}
    </div>
  )
}
