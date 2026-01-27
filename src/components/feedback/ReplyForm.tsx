'use client'

import { useState, useEffect } from 'react'
import { Loader2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createReply } from '@/lib/supabase/page-comments'
import { CommentReply } from '@/types/page-comment'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface ReplyFormProps {
  commentId: string
  guestId: string | null
  onSuccess: (reply: CommentReply) => void
  onCancel: () => void
}

export const ReplyForm = ({
  commentId,
  guestId,
  onSuccess,
  onCancel,
}: ReplyFormProps) => {
  const [content, setContent] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single()

        const profileData = profile as { display_name?: string | null } | null
        if (profileData?.display_name) {
          setDisplayName(profileData.display_name)
        }
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (content.length < 3) {
      toast.error('Reply must be at least 3 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createReply({
        comment_id: commentId,
        content: content.trim(),
        display_name: displayName.trim() || 'Anonymous',
        guest_id: guestId,
      })

      if (result.success && result.data) {
        toast.success('Reply posted!')
        onSuccess(result.data)
        setContent('')
      } else {
        toast.error(result.error || 'Failed to post reply')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ml-4 space-y-3 border-l-2 border-gray-700 pl-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className={cn(
          'min-h-[60px] resize-none border-gray-700 bg-gray-800 text-sm text-white',
          'placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500'
        )}
        maxLength={500}
      />

      <Input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your name (optional)"
        className="border-gray-700 bg-gray-800 text-sm text-white placeholder:text-gray-500"
        maxLength={50}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:bg-gray-700 hover:text-white"
          disabled={isSubmitting}
        >
          <X className="mr-1 h-3 w-3" />
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting || content.length < 3}
        >
          {isSubmitting ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Send className="mr-1 h-3 w-3" />
          )}
          Reply
        </Button>
      </div>
    </form>
  )
}
