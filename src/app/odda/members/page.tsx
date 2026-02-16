import Link from 'next/link'
import { Search, MapPin, Briefcase, ChevronLeft, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getMembers } from '@/lib/supabase/odda'
import { ProfileCard } from '@/components/odda'

interface Props {
  searchParams: Promise<{
    search?: string
    location?: string
    skill?: string
    open_to_work?: string
    page?: string
  }>
}

export default async function MembersPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const page = parseInt(params.page || '1')
  const { members, total } = await getMembers({
    search: params.search,
    location: params.location,
    skill: params.skill,
    is_open_to_work: params.open_to_work === 'true',
    page,
    limit: 20,
  })

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/odda">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to ODDA
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Find Members</h1>

          {/* Search */}
          <form className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={params.search}
                placeholder="Search by name, headline, or bio..."
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="location"
                defaultValue={params.location}
                placeholder="Location"
                className="pl-10"
              />
            </div>
            <Button type="submit">
              <Filter className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {params.search && (
              <Badge variant="secondary">
                Search: {params.search}
                <Link href={`/odda/members?${new URLSearchParams({ ...params, search: '' }).toString()}`} className="ml-2">
                  ×
                </Link>
              </Badge>
            )}
            {params.location && (
              <Badge variant="secondary">
                Location: {params.location}
                <Link href={`/odda/members?${new URLSearchParams({ ...params, location: '' }).toString()}`} className="ml-2">
                  ×
                </Link>
              </Badge>
            )}
            {params.skill && (
              <Badge variant="secondary">
                Skill: {params.skill}
                <Link href={`/odda/members?${new URLSearchParams({ ...params, skill: '' }).toString()}`} className="ml-2">
                  ×
                </Link>
              </Badge>
            )}
            {params.open_to_work === 'true' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Briefcase className="w-3 h-3 mr-1" />
                Open to work
                <Link href={`/odda/members?${new URLSearchParams({ ...params, open_to_work: '' }).toString()}`} className="ml-2">
                  ×
                </Link>
              </Badge>
            )}
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {params.open_to_work !== 'true' && (
              <Link href={`/odda/members?${new URLSearchParams({ ...params, open_to_work: 'true' }).toString()}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  <Briefcase className="w-3 h-3 mr-1" />
                  Open to work
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            {total} member{total !== 1 && 's'} found
          </p>

          {/* Members grid */}
          {members.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  showConnectButton={!!user && profile.user_id !== user.id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild
              >
                <Link href={`/odda/members?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}>
                  Previous
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild
              >
                <Link href={`/odda/members?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}>
                  Next
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
