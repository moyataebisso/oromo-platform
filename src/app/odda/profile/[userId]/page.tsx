import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  ChevronLeft, MapPin, Globe, Linkedin, Twitter, Github, Briefcase,
  GraduationCap, Award, Eye, Users, Calendar, ExternalLink, Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { getProfileByUserId, incrementProfileViews, getMutualConnections } from '@/lib/supabase/odda'
import { getPostsByUserId } from '@/lib/supabase/community'
import { ConnectionButton } from '@/components/odda'

interface Props {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const profile = await getProfileByUserId(userId)

  if (!profile) {
    notFound()
  }

  // Increment view count
  await incrementProfileViews(profile.id)

  // Get additional data
  const [mutualConnections, recentPosts] = await Promise.all([
    currentUser ? getMutualConnections(userId) : [],
    getPostsByUserId(userId, 3)
  ])

  const displayName = profile.user?.display_name || profile.user?.username || 'Anonymous'
  const initials = displayName.slice(0, 2).toUpperCase()
  const isOwnProfile = currentUser?.id === userId

  const formatDate = (date: string) => {
    if (date.length === 7) {
      // Format: YYYY-MM
      const [year, month] = date.split('-')
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    }
    return date
  }

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/odda">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to ODDA
            </Link>
          </Button>
        </div>
      </div>

      <main className="py-6 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Avatar className="w-28 h-28 ring-4 ring-background shadow-xl">
                      <AvatarImage src={profile.user?.avatar_url || undefined} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-emerald-500 to-amber-500 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h1 className="text-2xl font-bold">{displayName}</h1>
                          {profile.headline && (
                            <p className="text-muted-foreground">{profile.headline}</p>
                          )}
                        </div>
                        {isOwnProfile ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/odda/profile/edit">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </Link>
                          </Button>
                        ) : (
                          <ConnectionButton userId={userId} />
                        )}
                      </div>

                      {/* Location */}
                      {profile.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.is_open_to_work && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <Briefcase className="w-3 h-3 mr-1" />
                            Open to work
                          </Badge>
                        )}
                        {profile.is_open_to_hire && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Hiring
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {profile.connection_count} connections
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {profile.profile_views} views
                        </span>
                      </div>

                      {/* Links */}
                      {(profile.linkedin_url || profile.website_url || profile.twitter_url || profile.github_url) && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                          {profile.linkedin_url && (
                            <a
                              href={profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Linkedin className="w-5 h-5" />
                            </a>
                          )}
                          {profile.twitter_url && (
                            <a
                              href={profile.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="w-5 h-5" />
                            </a>
                          )}
                          {profile.github_url && (
                            <a
                              href={profile.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          {profile.website_url && (
                            <a
                              href={profile.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <Globe className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              {profile.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {profile.experiences && profile.experiences.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.experiences.map((exp, i) => (
                      <div key={exp.id}>
                        {i > 0 && <Separator className="mb-6" />}
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                            <Briefcase className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{exp.title}</h4>
                            <p className="text-muted-foreground">{exp.company_name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                              {exp.location && (
                                <>
                                  <span className="mx-2">·</span>
                                  <MapPin className="w-3 h-3" />
                                  {exp.location}
                                </>
                              )}
                            </p>
                            {exp.description && (
                              <p className="mt-2 text-sm">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.education.map((edu, i) => (
                      <div key={edu.id}>
                        {i > 0 && <Separator className="mb-6" />}
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{edu.institution_name}</h4>
                            {(edu.degree || edu.field_of_study) && (
                              <p className="text-muted-foreground">
                                {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                              </p>
                            )}
                            {(edu.start_date || edu.end_date) && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {edu.start_date} - {edu.end_date || 'Present'}
                              </p>
                            )}
                            {edu.description && (
                              <p className="mt-2 text-sm">{edu.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                          {skill.endorsement_count > 0 && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({skill.endorsement_count})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mutual Connections */}
              {mutualConnections.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Mutual Connections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mutualConnections.slice(0, 5).map((conn) => (
                      <Link
                        key={conn.id}
                        href={`/odda/profile/${conn.user_id}`}
                        className="flex items-center gap-3 hover:bg-accent -mx-2 px-2 py-2 rounded-lg transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conn.user?.avatar_url || undefined} />
                          <AvatarFallback>
                            {(conn.user?.display_name || 'A').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{conn.user?.display_name}</p>
                          {conn.headline && (
                            <p className="text-xs text-muted-foreground truncate">{conn.headline}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recent Forum Activity */}
              {recentPosts.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Forum Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/community/post/${post.id}`}
                        className="block hover:bg-accent -mx-2 px-2 py-2 rounded-lg transition-colors"
                      >
                        <p className="font-medium text-sm line-clamp-2">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </p>
                      </Link>
                    ))}
                    <Link
                      href={`/community?author=${userId}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View all posts
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Profile Info */}
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
