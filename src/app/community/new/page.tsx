'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import type { ForumCategory, ForumPost } from '@/types/community'

export default function NewPostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultCategory = searchParams.get('category') || ''

  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthAndLoadCategories = async () => {
      const supabase = createClient()

      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please log in to create a post')
        router.push('/login?redirect=/community/new')
        return
      }
      setIsAuthenticated(true)

      // Load categories
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .order('display_order') as { data: ForumCategory[] | null }

      if (data) {
        setCategories(data)
        // Set default category if provided in URL
        if (defaultCategory) {
          const cat = data.find(c => c.slug === defaultCategory)
          if (cat) setCategoryId(cat.id)
        }
      }
      setIsLoading(false)
    }

    checkAuthAndLoadCategories()
  }, [router, defaultCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!content.trim()) {
      toast.error('Please enter content')
      return
    }

    if (!categoryId) {
      toast.error('Please select a category')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in to create a post')
        return
      }

      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert({
          category_id: categoryId,
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        } as never)
        .select()
        .single() as { data: ForumPost | null; error: Error | null }

      if (error || !post) throw error || new Error('Failed to create post')

      toast.success('Post created successfully!')
      router.push(`/community/post/${post.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/community">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Community
            </Link>
          </Button>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create a New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="An interesting title for your post"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {title.length}/300
                  </p>
                </div>

                {/* Content with Preview */}
                <div className="space-y-2">
                  <Label>Content * (Markdown supported)</Label>
                  <Tabs defaultValue="write" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write" className="gap-2">
                        <Edit3 className="w-4 h-4" />
                        Write
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here. You can use **bold**, *italic*, and other Markdown formatting."
                        rows={12}
                        className="resize-none font-mono"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[288px] p-4 border rounded-md bg-muted/50">
                        {content ? (
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">
                            Nothing to preview yet. Start writing!
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Markdown help */}
                <div className="p-4 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Markdown Tips:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li><code className="bg-background px-1 rounded">**bold**</code> for <strong>bold text</strong></li>
                    <li><code className="bg-background px-1 rounded">*italic*</code> for <em>italic text</em></li>
                    <li><code className="bg-background px-1 rounded">[link](url)</code> for links</li>
                    <li><code className="bg-background px-1 rounded">- item</code> for bullet points</li>
                    <li><code className="bg-background px-1 rounded">`code`</code> for inline code</li>
                  </ul>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
