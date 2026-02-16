'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, RefreshCw, Loader2, Check, X, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface NewsSource {
  id: string
  name: string
  url: string
  rss_url: string | null
  category: string | null
  is_active: boolean | null
  auto_publish: boolean | null
  last_fetched_at: string | null
}

interface FetchLog {
  id: string
  source_id: string | null
  articles_fetched: number | null
  status: string | null
  error_message: string | null
  fetched_at: string | null
  news_sources?: { name: string } | null
}

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

export default function NewsSourcesPage() {
  const [sources, setSources] = useState<NewsSource[]>([])
  const [logs, setLogs] = useState<FetchLog[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [fetchResult, setFetchResult] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    rss_url: '',
    category: 'breaking',
    is_active: true,
    auto_publish: false,
  })

  const supabase = createClient()

  const fetchSources = async () => {
    const { data } = await supabase
      .from('news_sources')
      .select('*')
      .order('name')
    setSources(data || [])
  }

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('news_fetch_logs')
      .select('*, news_sources(name)')
      .order('fetched_at', { ascending: false })
      .limit(20)
    setLogs(data || [])
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchSources(), fetchLogs()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleFetchNow = async () => {
    setFetching(true)
    setFetchResult(null)

    try {
      const response = await fetch('/api/news/fetch', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + (process.env.NEXT_PUBLIC_NEWS_FETCH_API_KEY || 'oromo-news-secret-2024'),
        },
      })
      const result = await response.json()
      setFetchResult(JSON.stringify(result, null, 2))
      await Promise.all([fetchSources(), fetchLogs()])
    } catch (error) {
      setFetchResult('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setFetching(false)
    }
  }

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.url) {
      alert('Name and URL are required')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('news_sources').insert(newSource)
    if (error) {
      alert('Error adding source: ' + error.message)
      return
    }

    setShowAddDialog(false)
    setNewSource({
      name: '',
      url: '',
      rss_url: '',
      category: 'breaking',
      is_active: true,
      auto_publish: false,
    })
    await fetchSources()
  }

  const toggleActive = async (id: string, currentValue: boolean | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('news_sources')
      .update({ is_active: !currentValue })
      .eq('id', id)
    await fetchSources()
  }

  const deleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('news_sources').delete().eq('id', id)
    await fetchSources()
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
          <h1 className="text-3xl font-bold text-foreground">News Sources</h1>
          <p className="text-muted-foreground">Manage RSS feeds and news sources</p>
        </div>
        <Button onClick={handleFetchNow} disabled={fetching}>
          {fetching ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Fetch Now
        </Button>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add News Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newSource.name}
                  onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Source name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Website URL *</Label>
                <Input
                  id="url"
                  value={newSource.url}
                  onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rss_url">RSS Feed URL</Label>
                <Input
                  id="rss_url"
                  value={newSource.rss_url}
                  onChange={(e) => setNewSource(prev => ({ ...prev, rss_url: e.target.value }))}
                  placeholder="https://example.com/rss"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newSource.category}
                  onValueChange={(value) => setNewSource(prev => ({ ...prev, category: value }))}
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
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={newSource.is_active}
                  onCheckedChange={(checked) => setNewSource(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="auto_publish"
                  checked={newSource.auto_publish}
                  onCheckedChange={(checked) => setNewSource(prev => ({ ...prev, auto_publish: checked }))}
                />
                <Label htmlFor="auto_publish">Auto-publish fetched articles</Label>
              </div>
              <Button onClick={handleAddSource} className="w-full">
                Add Source
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fetch Result */}
      {fetchResult && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Fetch Result:</h3>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg overflow-auto max-h-48">
            {fetchResult}
          </pre>
        </div>
      )}

      {/* Sources Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>RSS URL</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Last Fetched</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No sources configured
                </TableCell>
              </TableRow>
            ) : (
              sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-32 truncate">
                    {source.url}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-32 truncate">
                    {source.rss_url || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {source.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {source.last_fetched_at
                      ? new Date(source.last_fetched_at).toLocaleString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    {source.is_active ? (
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(source.id, source.is_active)}
                        title={source.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {source.is_active ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSource(source.id)}
                        className="text-destructive hover:text-destructive"
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

      {/* Recent Fetch Logs */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Fetch Logs</h2>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No fetch logs yet</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-4 p-3 bg-muted rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium">
                    {log.news_sources?.name || 'Unknown Source'}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {log.articles_fetched} articles
                  </span>
                </div>
                {log.status === 'success' ? (
                  <Badge className="bg-green-500/20 text-green-400">Success</Badge>
                ) : (
                  <Badge variant="destructive">Error</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {log.fetched_at ? new Date(log.fetched_at).toLocaleString() : '-'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
