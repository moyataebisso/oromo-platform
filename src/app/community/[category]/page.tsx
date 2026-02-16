import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getCategoryBySlug, getPosts } from '@/lib/supabase/community'
import { CategoryList, PostList } from '@/components/community'
import type { SortOption } from '@/types/community'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

const categoryIcons: Record<string, string> = {
  general: '💬',
  culture: '🎭',
  language: '📚',
  history: '📜',
  diaspora: '🌍',
  business: '💼',
  technology: '💻',
  education: '🎓',
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params
  const queryParams = await searchParams

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

  const category = await getCategoryBySlug(categorySlug)
  if (!category) {
    notFound()
  }

  const sort = (queryParams.sort as SortOption) || 'hot'
  const page = parseInt(queryParams.page || '1')

  const [categories, { posts, total }] = await Promise.all([
    getCategories(),
    getPosts({ category: categorySlug, sort, page, limit: 20 })
  ])

  return (
    <div className="bg-background">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/community">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Community
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: category.color ? `${category.color}20` : undefined }}
            >
              {categoryIcons[category.slug] || category.icon || '📁'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block space-y-6">
              <CategoryList categories={categories} />
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2">
              <PostList
                posts={posts}
                total={total}
                currentPage={page}
                pageSize={20}
                sort={sort}
                baseUrl={`/community/${categorySlug}`}
                categorySlug={categorySlug}
                showCategory={false}
                isModerator={isModerator}
                isLoggedIn={!!user}
              />
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">About this category</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {category.description || `Discussions related to ${category.name.toLowerCase()}.`}
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium text-foreground">{category.post_count} posts</p>
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
