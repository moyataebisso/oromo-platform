'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Check, Edit, Trash2, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
  summary: string | null
  category: string | null
  source: string | null
  image_url: string | null
  created_at: string | null
}

export default function ReviewQueuePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<'approve' | 'delete' | null>(null)

  const supabase = createClient()

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('news_articles')
      .select('id, title, slug, summary, category, source, image_url, created_at')
      .eq('is_published', false)
      .order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === articles.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(articles.map(a => a.id)))
    }
  }

  const approveArticle = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('news_articles')
      .update({ is_published: true })
      .eq('id', id)
    await fetchArticles()
    setSelected(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const deleteArticle = async () => {
    if (!deleteId) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('news_articles').delete().eq('id', deleteId)
    setDeleteId(null)
    await fetchArticles()
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selected.size === 0) return

    if (bulkAction === 'approve') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('news_articles')
        .update({ is_published: true })
        .in('id', Array.from(selected))
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('news_articles')
        .delete()
        .in('id', Array.from(selected))
    }

    setBulkAction(null)
    setSelected(new Set())
    await fetchArticles()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Review Queue</h1>
          <p className="text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
      </div>

      {/* Bulk Actions */}
      {articles.length > 0 && (
        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
          <Checkbox
            checked={selected.size === articles.length && articles.length > 0}
            onCheckedChange={selectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selected.size} selected
          </span>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            disabled={selected.size === 0}
            onClick={() => setBulkAction('approve')}
          >
            <Check className="w-4 h-4 mr-2" />
            Approve Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selected.size === 0}
            onClick={() => setBulkAction('delete')}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-semibold mb-2">No articles pending review</h2>
          <p className="text-muted-foreground">
            All caught up! New articles from RSS feeds will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all ${
                selected.has(article.id)
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border'
              }`}
            >
              {/* Image */}
              <div className="aspect-video relative bg-muted">
                {article.image_url ? (
                  <Image
                    src={article.image_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    📰
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selected.has(article.id)}
                    onCheckedChange={() => toggleSelect(article.id)}
                    className="bg-background/80"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {article.category}
                  </Badge>
                  {article.source && (
                    <span className="text-xs text-muted-foreground">
                      via {article.source}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {article.summary}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mb-4">
                  Fetched {article.created_at ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true }) : 'unknown'}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveArticle(article.id)}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Link href={`/admin/news/${article.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(article.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Bulk Action Confirmation */}
      <AlertDialog open={!!bulkAction} onOpenChange={() => setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === 'approve' ? 'Approve Articles' : 'Delete Articles'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction} {selected.size} article{selected.size !== 1 ? 's' : ''}?
              {bulkAction === 'delete' && ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkAction}
              className={bulkAction === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {bulkAction === 'approve' ? 'Approve' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
