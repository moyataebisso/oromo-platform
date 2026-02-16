'use client'

import Link from 'next/link'
import { MapPin, Briefcase, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ProfessionalProfile } from '@/types/odda'

interface ProfileCardProps {
  profile: ProfessionalProfile
  showConnectButton?: boolean
  onConnect?: () => void
  className?: string
}

export function ProfileCard({
  profile,
  showConnectButton = true,
  onConnect,
  className
}: ProfileCardProps) {
  const displayName = profile.user?.display_name || profile.user?.username || 'Anonymous'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <Card className={cn('group hover:shadow-md transition-shadow', className)}>
      <CardContent className="pt-6">
        <div className="text-center">
          {/* Avatar */}
          <Link href={`/odda/profile/${profile.user_id}`}>
            <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-background shadow-lg group-hover:ring-primary/20 transition-all">
              <AvatarImage src={profile.user?.avatar_url || undefined} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Name */}
          <Link
            href={`/odda/profile/${profile.user_id}`}
            className="block font-semibold text-lg hover:text-primary transition-colors"
          >
            {displayName}
          </Link>

          {/* Headline */}
          {profile.headline && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {profile.headline}
            </p>
          )}

          {/* Location */}
          {profile.location && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-2">
              <MapPin className="w-3 h-3" />
              {profile.location}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {profile.is_open_to_work && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Briefcase className="w-3 h-3 mr-1" />
                Open to work
              </Badge>
            )}
            {profile.is_open_to_hire && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Hiring
              </Badge>
            )}
          </div>

          {/* Connection count */}
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-3">
            <Users className="w-3 h-3" />
            {profile.connection_count} connections
          </p>

          {/* Actions */}
          {showConnectButton && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onConnect}
              >
                Connect
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
