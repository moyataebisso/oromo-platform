import Link from 'next/link'
import { Users, TrendingUp, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getPosts } from '@/lib/supabase/community'
import { CategoryList, PostList, SearchBar } from '@/components/community'
import type { SortOption } from '@/types/community'

interface Props {
  searchParams: Promise<{ sort?: string; page?: string; search?: string }>
}

export default async function CommunityPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user role for moderator check
  let isModerator = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }
    isModerator = profile?.role === 'moderator' || profile?.role === 'admin'
  }

  const sort = (params.sort as SortOption) || 'hot'
  const page = parseInt(params.page || '1')
  const search = params.search

  const [categories, { posts, total }] = await Promise.all([
    getCategories(),
    getPosts({ sort, page, limit: 20, search })
  ])

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Community Forum</h1>
              <p className="text-muted-foreground">
                Connect, share, and learn with the Oromo community worldwide
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-xl">
            <SearchBar initialQuery={search} placeholder="Search discussions..." />
          </div>
        </div>
      </div>

      <main className="py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block space-y-6">
              <CategoryList categories={categories} />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['OromoHistory', 'CommunityEvents', 'LearnOromo', 'OromoCulture', 'DiasporaLife'].map((topic, i) => (
                    <Link
                      key={i}
                      href={`/community?search=${topic}`}
                      className="flex items-center justify-between hover:bg-accent -mx-2 px-2 py-1 rounded transition-colors"
                    >
                      <span className="text-sm font-medium text-primary">#{topic}</span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2">
              {search && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Showing results for: <span className="font-medium text-foreground">&quot;{search}&quot;</span>
                    {' '}
                    <Link href="/community" className="text-primary hover:underline">
                      Clear search
                    </Link>
                  </p>
                </div>
              )}

              <PostList
                posts={posts}
                total={total}
                currentPage={page}
                pageSize={20}
                sort={sort}
                baseUrl="/community"
                showCategory={true}
                isModerator={isModerator}
                isLoggedIn={!!user}
              />
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>1. Be respectful and kind to all members</p>
                  <p>2. No hate speech or discrimination</p>
                  <p>3. Keep discussions constructive</p>
                  <p>4. Report inappropriate content</p>
                  <p>5. Use appropriate categories for posts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Join ODDA Network</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-3">
                    Connect with Oromo professionals worldwide. Build your network and discover opportunities.
                  </p>
                  <Link
                    href="/odda"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Explore ODDA Network →
                  </Link>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{total}</p>
                      <p className="text-xs text-muted-foreground">Total Posts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{categories.length}</p>
                      <p className="text-xs text-muted-foreground">Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
