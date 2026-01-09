'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type NewsArticle = Database['public']['Tables']['news_articles']['Row']
type NewsArticleUpdate = Database['public']['Tables']['news_articles']['Update']
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

const categories = [
  { value: 'breaking', label: 'Breaking' },
  { value: 'politics', label: 'Politics' },
  { value: 'culture', label: 'Culture' },
  { value: 'sports', label: 'Sports' },
  { value: 'business', label: 'Business' },
  { value: 'diaspora', label: 'Diaspora' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
]

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'breaking',
    author: '',
    source: '',
    source_url: '',
    image_url: '',
    published_at: '',
    is_featured: false,
    is_published: false,
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        alert('Article not found')
        router.push('/admin/news')
        return
      }

      const article = data as NewsArticle

      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        summary: article.summary || '',
        content: article.content || '',
        category: article.category || 'breaking',
        author: article.author || '',
        source: article.source || '',
        source_url: article.source_url || '',
        image_url: article.image_url || '',
        published_at: article.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : '',
        is_featured: article.is_featured || false,
        is_published: article.is_published || false,
      })
      setLoading(false)
    }

    fetchArticle()
  }, [id, router, supabase])

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }

    setSaving(true)

    const updateData: NewsArticleUpdate = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      category: formData.category,
      author: formData.author,
      source: formData.source,
      source_url: formData.source_url,
      image_url: formData.image_url,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : undefined,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('news_articles')
      .update(updateData)
      .eq('id', id)

    if (error) {
      alert('Error saving article: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/admin/news')
  }

  const handleDelete = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('news_articles').delete().eq('id', id)

    if (error) {
      alert('Error deleting article: ' + error.message)
      return
    }

    router.push('/admin/news')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
          <p className="text-muted-foreground">Update news article</p>
        </div>
        {formData.is_published && formData.slug && (
          <Link href={`/news/${formData.slug}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Article
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Title & Slug */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Article title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="article-url-slug"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="summary">Summary</Label>
            <span className="text-xs text-muted-foreground">{formData.summary.length}/300</span>
          </div>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value.slice(0, 300) }))}
            placeholder="Brief summary of the article"
            rows={2}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <p className="text-xs text-muted-foreground">Supports Markdown formatting</p>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Full article content..."
            rows={12}
            className="font-mono"
          />
        </div>

        {/* Category & Author */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Source */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source Name</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="e.g., BBC News"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source_url">Source URL</Label>
            <Input
              id="source_url"
              type="url"
              value={formData.source_url}
              onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://..."
          />
          {formData.image_url && (
            <div className="mt-2 relative aspect-video max-w-sm bg-muted rounded-lg overflow-hidden">
              <Image
                src={formData.image_url}
                alt="Preview"
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Published Date */}
        <div className="space-y-2">
          <Label htmlFor="published_at">Published Date</Label>
          <Input
            id="published_at"
            type="datetime-local"
            value={formData.published_at}
            onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
            />
            <Label htmlFor="is_featured">Featured Article</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published">Published</Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <div className="flex-1" />
          <Link href="/admin/news">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{formData.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
