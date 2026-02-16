'use client'

import { useState } from 'react'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface VoteButtonProps {
  type: 'post' | 'comment'
  id: string
  upvotes: number
  downvotes: number
  userVote: number | null
  vertical?: boolean
  size?: 'sm' | 'md'
}

export function VoteButton({
  type,
  id,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  userVote: initialUserVote,
  vertical = false,
  size = 'md'
}: VoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [isLoading, setIsLoading] = useState(false)

  const score = upvotes - downvotes

  const handleVote = async (voteType: 1 | -1) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Please log in to vote')
      return
    }

    setIsLoading(true)

    // Optimistic update
    const previousVote = userVote

    if (userVote === voteType) {
      // Removing vote
      setUserVote(null)
      if (voteType === 1) setUpvotes(prev => prev - 1)
      else setDownvotes(prev => prev - 1)
    } else {
      // Adding or changing vote
      if (previousVote === 1) setUpvotes(prev => prev - 1)
      if (previousVote === -1) setDownvotes(prev => prev - 1)

      setUserVote(voteType)
      if (voteType === 1) setUpvotes(prev => prev + 1)
      else setDownvotes(prev => prev + 1)
    }

    const field = type === 'post' ? 'post_id' : 'comment_id'

    try {
      // Check existing vote
      const { data: existingVote } = await supabase
        .from('forum_votes')
        .select('id, vote_type')
        .eq('user_id', user.id)
        .eq(field, id)
        .single() as { data: { id: string; vote_type: number } | null }

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase.from('forum_votes').delete().eq('id', existingVote.id)
        } else {
          // Change vote
          await supabase.from('forum_votes').update({ vote_type: voteType } as never).eq('id', existingVote.id)
        }
      } else {
        // New vote
        await supabase.from('forum_votes').insert({
          user_id: user.id,
          [field]: id,
          vote_type: voteType,
        } as never)
      }
    } catch {
      // Revert on error
      setUserVote(previousVote)
      if (voteType === 1) {
        setUpvotes(prev => userVote === voteType ? prev + 1 : prev - 1)
      } else {
        setDownvotes(prev => userVote === voteType ? prev + 1 : prev - 1)
      }
      toast.error('Failed to vote')
    } finally {
      setIsLoading(false)
    }
  }

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const buttonSize = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'

  return (
    <div className={cn(
      'flex items-center gap-1',
      vertical && 'flex-col'
    )}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          'rounded-full',
          userVote === 1 && 'text-orange-500 bg-orange-500/10'
        )}
        onClick={() => handleVote(1)}
        disabled={isLoading}
      >
        <ArrowBigUp className={cn(iconSize, userVote === 1 && 'fill-current')} />
      </Button>
      <span className={cn(
        'font-semibold text-sm min-w-[2ch] text-center',
        score > 0 && 'text-orange-500',
        score < 0 && 'text-blue-500'
      )}>
        {score}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          'rounded-full',
          userVote === -1 && 'text-blue-500 bg-blue-500/10'
        )}
        onClick={() => handleVote(-1)}
        disabled={isLoading}
      >
        <ArrowBigDown className={cn(iconSize, userVote === -1 && 'fill-current')} />
      </Button>
    </div>
  )
}
