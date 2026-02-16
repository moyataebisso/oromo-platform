'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Eye, Edit, Trash2, Star, StarOff, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Article {
  id: string
  title: string
  slug: string
  category: string | null
  author: string | null
  published_at: string | null
  is_published: boolean | null
  is_featured: boolean | null
  view_count: number | null
  image_url: string | null
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'breaking', label: 'Breaking' },
  { value: 'politics', label: 'Politics' },
  { value: 'culture', label: 'Culture' },
  { value: 'sports', label: 'Sports' },
  { value: 'business', label: 'Business' },
  { value: 'diaspora', label: 'Diaspora' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
]

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0
  })

  const supabase = createClient()

  const fetchArticles = async () => {
    setLoading(true)
    let query = supabase
      .from('news_articles')
      .select('id, title, slug, category, author, published_at, is_published, is_featured, view_count, image_url')
      .order('published_at', { ascending: false })

    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter)
    }

    if (statusFilter === 'published') {
      query = query.eq('is_published', true)
    } else if (statusFilter === 'draft') {
      query = query.eq('is_published', false)
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }

    const { data } = await query
    setArticles(data || [])
    setLoading(false)
  }

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })

    const { count: published } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    const { count: featured } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)

    setStats({
      total: total || 0,
      published: published || 0,
      drafts: (total || 0) - (published || 0),
      featured: featured || 0
    })
  }

  useEffect(() => {
    fetchArticles()
    fetchStats()
  }, [categoryFilter, statusFilter, searchQuery])

  const togglePublished = async (id: string, currentValue: boolean | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('news_articles')
      .update({ is_published: !currentValue })
      .eq('id', id)
    fetchArticles()
    fetchStats()
  }

  const toggleFeatured = async (id: string, currentValue: boolean | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('news_articles')
      .update({ is_featured: !currentValue })
      .eq('id', id)
    fetchArticles()
    fetchStats()
  }

  const deleteArticle = async () => {
    if (!deleteId) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('news_articles').delete().eq('id', deleteId)
    setDeleteId(null)
    fetchArticles()
    fetchStats()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground mt-1">Manage news articles and content</p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Articles</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-500">{stats.published}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.drafts}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="text-2xl font-bold text-purple-500">{stats.featured}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Articles Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                      {article.image_url ? (
                        <Image
                          src={article.image_url}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          📰
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium text-foreground truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{article.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {article.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {article.author || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {article.is_published ? (
                        <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {article.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {article.view_count || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeatured(article.id, article.is_featured)}
                        title={article.is_featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {article.is_featured ? (
                          <StarOff className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePublished(article.id, article.is_published)}
                        title={article.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {article.is_published ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                      <Link href={`/news/${article.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/news/${article.id}`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(article.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteArticle} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
