'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users, Clock, Send, UserCheck, UserMinus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Connection } from '@/types/odda'

export default function ConnectionsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([])
  const [sentRequests, setSentRequests] = useState<Connection[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in')
        router.push('/login?redirect=/odda/connections')
        return
      }

      setCurrentUserId(user.id)

      // Load connections (accepted)
      const { data: connectionsData } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'accepted')
        .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)

      // Load pending requests (received)
      const { data: pendingData } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'pending')
        .eq('connected_user_id', user.id)

      // Load sent requests
      const { data: sentData } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'pending')
        .eq('user_id', user.id)

      setConnections(connectionsData || [])
      setPendingRequests(pendingData || [])
      setSentRequests(sentData || [])
      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleAccept = async (connectionId: string) => {
    setActionLoading(connectionId)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted', updated_at: new Date().toISOString() } as never)
        .eq('id', connectionId)

      if (error) throw error

      // Move from pending to connections
      const accepted = pendingRequests.find(r => r.id === connectionId)
      if (accepted) {
        setPendingRequests(pendingRequests.filter(r => r.id !== connectionId))
        setConnections([...connections, { ...accepted, status: 'accepted' }])
      }
      toast.success('Connection accepted!')
    } catch {
      toast.error('Failed to accept connection')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (connectionId: string) => {
    setActionLoading(connectionId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('connections').delete().eq('id', connectionId)

      if (error) throw error

      setPendingRequests(pendingRequests.filter(r => r.id !== connectionId))
      toast.success('Request declined')
    } catch {
      toast.error('Failed to decline request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (connectionId: string) => {
    setActionLoading(connectionId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('connections').delete().eq('id', connectionId)

      if (error) throw error

      setSentRequests(sentRequests.filter(r => r.id !== connectionId))
      toast.success('Request cancelled')
    } catch {
      toast.error('Failed to cancel request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemove = async (connectionId: string) => {
    if (!confirm('Are you sure you want to remove this connection?')) return

    setActionLoading(connectionId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('connections').delete().eq('id', connectionId)

      if (error) throw error

      setConnections(connections.filter(c => c.id !== connectionId))
      toast.success('Connection removed')
    } catch {
      toast.error('Failed to remove connection')
    } finally {
      setActionLoading(null)
    }
  }

  const getConnectionUser = (connection: Connection) => {
    if (connection.user_id === currentUserId) {
      return connection.addressee
    }
    return connection.requester
  }

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/odda">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to ODDA
            </Link>
          </Button>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">My Connections</h1>

          <Tabs defaultValue="connections">
            <TabsList className="mb-6">
              <TabsTrigger value="connections" className="gap-2">
                <Users className="w-4 h-4" />
                Connections
                {connections.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {connections.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Pending
                {pendingRequests.length > 0 && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Send className="w-4 h-4" />
                Sent
                {sentRequests.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {sentRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Connections */}
            <TabsContent value="connections">
              {connections.length > 0 ? (
                <div className="space-y-4">
                  {connections.map(connection => {
                    const profile = getConnectionUser(connection)
                    const displayName = profile?.user?.display_name || 'Anonymous'
                    const initials = displayName.slice(0, 2).toUpperCase()

                    return (
                      <Card key={connection.id}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between gap-4">
                            <Link
                              href={`/odda/profile/${profile?.user_id}`}
                              className="flex items-center gap-3 min-w-0 flex-1"
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={profile?.user?.avatar_url || undefined} />
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{displayName}</p>
                                {profile?.headline && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {profile.headline}
                                  </p>
                                )}
                              </div>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemove(connection.id)}
                              disabled={actionLoading === connection.id}
                            >
                              {actionLoading === connection.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your network by connecting with other members
                    </p>
                    <Button asChild>
                      <Link href="/odda/members">Find Members</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Pending Requests */}
            <TabsContent value="pending">
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map(request => {
                    const profile = request.requester
                    const displayName = profile?.user?.display_name || 'Anonymous'
                    const initials = displayName.slice(0, 2).toUpperCase()

                    return (
                      <Card key={request.id}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between gap-4">
                            <Link
                              href={`/odda/profile/${profile?.user_id}`}
                              className="flex items-center gap-3 min-w-0 flex-1"
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={profile?.user?.avatar_url || undefined} />
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{displayName}</p>
                                {profile?.headline && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {profile.headline}
                                  </p>
                                )}
                                {request.message && (
                                  <p className="text-sm text-muted-foreground mt-1 italic">
                                    &quot;{request.message}&quot;
                                  </p>
                                )}
                              </div>
                            </Link>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAccept(request.id)}
                                disabled={actionLoading === request.id}
                              >
                                {actionLoading === request.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Accept
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(request.id)}
                                disabled={actionLoading === request.id}
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">
                      When someone sends you a connection request, it will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sent Requests */}
            <TabsContent value="sent">
              {sentRequests.length > 0 ? (
                <div className="space-y-4">
                  {sentRequests.map(request => {
                    const profile = request.addressee
                    const displayName = profile?.user?.display_name || 'Anonymous'
                    const initials = displayName.slice(0, 2).toUpperCase()

                    return (
                      <Card key={request.id}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between gap-4">
                            <Link
                              href={`/odda/profile/${profile?.user_id}`}
                              className="flex items-center gap-3 min-w-0 flex-1"
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={profile?.user?.avatar_url || undefined} />
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{displayName}</p>
                                {profile?.headline && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {profile.headline}
                                  </p>
                                )}
                              </div>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(request.id)}
                              disabled={actionLoading === request.id}
                            >
                              {actionLoading === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Cancel'
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Send className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
                    <p className="text-muted-foreground mb-4">
                      Find and connect with other members
                    </p>
                    <Button asChild>
                      <Link href="/odda/members">Find Members</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
