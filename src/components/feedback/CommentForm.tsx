'use client'

import { useState, useEffect } from 'react'
import { Loader2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createComment } from '@/lib/supabase/page-comments'
import { PageComment, CommentType, COMMENT_TYPE_CONFIG } from '@/types/page-comment'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface CommentFormProps {
  pagePath: string
  guestId: string | null
  onSuccess: (comment: PageComment) => void
  onCancel: () => void
}

export const CommentForm = ({
  pagePath,
  guestId,
  onSuccess,
  onCancel,
}: CommentFormProps) => {
  const [commentType, setCommentType] = useState<CommentType>('general')
  const [content, setContent] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ display_name?: string | null } | null>(null)

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser(profile as { display_name?: string | null })
          setDisplayName((profile as { display_name?: string | null }).display_name || '')
        }
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (content.length < 10) {
      toast.error('Comment must be at least 10 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createComment({
        page_path: pagePath,
        page_title: document.title,
        comment_type: commentType,
        content: content.trim(),
        display_name: displayName.trim() || 'Anonymous',
        guest_id: guestId,
      })

      if (result.success && result.data) {
        toast.success('Thanks for your feedback!')
        onSuccess(result.data)
        setContent('')
        setDisplayName(user?.display_name || '')
      } else {
        toast.error(result.error || 'Failed to post comment')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const typeOptions: { value: CommentType; label: string; icon: string }[] = [
    { value: 'error', label: 'Report an Error', icon: '' },
    { value: 'suggestion', label: 'Suggestion', icon: '' },
    { value: 'question', label: 'Question', icon: '' },
    { value: 'general', label: 'General Comment', icon: '' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Comment Type */}
      <div className="space-y-2">
        <Label htmlFor="type" className="text-gray-300">
          Type
        </Label>
        <Select
          value={commentType}
          onValueChange={(v) => setCommentType(v as CommentType)}
        >
          <SelectTrigger
            id="type"
            className="border-gray-700 bg-gray-800 text-white"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            {typeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 focus:bg-gray-700 focus:text-white"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      COMMENT_TYPE_CONFIG[option.value].bgClass
                    )}
                  />
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-gray-300">
          Your Feedback
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            commentType === 'error'
              ? "Describe the error you found..."
              : commentType === 'suggestion'
              ? "What would you like to suggest?"
              : commentType === 'question'
              ? "What's your question?"
              : "Share your thoughts..."
          }
          className={cn(
            'min-h-[100px] resize-none border-gray-700 bg-gray-800 text-white',
            'placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500'
          )}
          maxLength={1000}
        />
        <p className="text-right text-xs text-gray-500">
          {content.length}/1000 characters
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-300">
          Your Name{' '}
          <span className="text-gray-500">(optional)</span>
        </Label>
        <Input
          id="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Anonymous"
          className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
          maxLength={50}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1 text-gray-400 hover:bg-gray-800 hover:text-white"
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={isSubmitting || content.length < 10}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  )
}
