'use client'

import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CommentReply } from '@/types/page-comment'
import { formatDistanceToNow } from 'date-fns'

interface ReplyCardProps {
  reply: CommentReply
  guestId: string | null
  currentUserId: string | null
}

export const ReplyCard = ({ reply, guestId, currentUserId }: ReplyCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(reply.created_at), {
    addSuffix: true,
  })

  const isOwner =
    (reply.user_id && reply.user_id === currentUserId) ||
    (reply.guest_id && reply.guest_id === guestId)

  return (
    <div className="ml-4 border-l-2 border-gray-700 pl-4">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <Avatar className="h-6 w-6">
          {reply.user?.avatar_url ? (
            <AvatarImage src={reply.user.avatar_url} />
          ) : null}
          <AvatarFallback className="bg-gray-700 text-gray-300">
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium text-white">
          {reply.display_name || 'Anonymous'}
        </span>
        {!reply.user_id && (
          <Badge
            variant="outline"
            className="border-gray-600 text-[9px] text-gray-400"
          >
            Guest
          </Badge>
        )}
        <span className="text-[10px] text-gray-500">{timeAgo}</span>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-300">{reply.content}</p>
    </div>
  )
}
