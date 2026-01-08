'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Send,
  TrendingUp,
  Hash,
  Bell,
  Search,
  Filter,
  Plus,
  Flag,
  Bookmark,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock user
const currentUser = {
  id: '1',
  name: 'Bekele Abera',
  avatar: null,
  initials: 'BA',
}

// Mock posts
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Fatima Hassan',
      avatar: null,
      initials: 'FH',
      verified: true,
    },
    content: 'Just started learning Oromo through the Academy courses and I\'m amazed at how comprehensive they are! The lessons on Gadaa system were particularly enlightening. Has anyone else completed the history section?',
    image: null,
    likes: 45,
    comments: 12,
    shares: 5,
    createdAt: '2 hours ago',
    category: 'education',
    liked: false,
    bookmarked: false,
  },
  {
    id: '2',
    author: {
      name: 'Mohamed Ali',
      avatar: null,
      initials: 'MA',
      verified: false,
    },
    content: 'Proud to announce that our Oromo Cultural Association is hosting a community dinner next Saturday! All are welcome. Let\'s celebrate our heritage together. 🇪🇹',
    image: null,
    likes: 128,
    comments: 34,
    shares: 45,
    createdAt: '5 hours ago',
    category: 'events',
    liked: true,
    bookmarked: true,
  },
  {
    id: '3',
    author: {
      name: 'Sara Tadesse',
      avatar: null,
      initials: 'ST',
      verified: true,
    },
    content: 'Looking for recommendations on traditional Oromo music to share with my children. They\'re growing up in the diaspora and I want them to stay connected to our culture. Any suggestions?',
    image: null,
    likes: 67,
    comments: 28,
    shares: 8,
    createdAt: '8 hours ago',
    category: 'culture',
    liked: false,
    bookmarked: false,
  },
  {
    id: '4',
    author: {
      name: 'Oromo Business Network',
      avatar: null,
      initials: 'OBN',
      verified: true,
    },
    content: 'New job opportunity! Software Engineer position at an Oromo-owned tech company in Seattle. Great benefits and inclusive workplace. Check the careers section for more details.',
    image: null,
    likes: 89,
    comments: 15,
    shares: 56,
    createdAt: '1 day ago',
    category: 'careers',
    liked: false,
    bookmarked: true,
  },
]

// Trending topics
const trendingTopics = [
  { tag: 'OromoHistory', posts: 234 },
  { tag: 'CommunityEvents', posts: 189 },
  { tag: 'LearnOromo', posts: 156 },
  { tag: 'OromoCulture', posts: 145 },
  { tag: 'DiasporaLife', posts: 112 },
]

// Categories
const categories = [
  { id: 'all', name: 'All Posts' },
  { id: 'education', name: 'Education' },
  { id: 'culture', name: 'Culture' },
  { id: 'events', name: 'Events' },
  { id: 'careers', name: 'Careers' },
  { id: 'questions', name: 'Q&A' },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ))
  }

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return

    const newPost = {
      id: Date.now().toString(),
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        initials: currentUser.initials,
        verified: false,
      },
      content: newPostContent,
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: 'Just now',
      category: 'general',
      liked: false,
      bookmarked: false,
    }

    setPosts([newPost, ...posts])
    setNewPostContent('')
    setShowNewPostForm(false)
  }

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-slate-900">
                Oromo
              </Link>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-slate-900">Community</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search community..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-100 text-purple-700">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        selectedCategory === cat.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, i) => (
                    <Link
                      key={i}
                      href={`/community/topic/${topic.tag}`}
                      className="flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 py-1 rounded"
                    >
                      <span className="text-sm font-medium text-purple-600">#{topic.tag}</span>
                      <span className="text-xs text-slate-400">{topic.posts} posts</span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* New Post */}
              <Card>
                <CardContent className="pt-4">
                  {showNewPostForm ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {currentUser.initials}
                          </AvatarFallback>
                        </Avatar>
                        <Textarea
                          placeholder="Share your thoughts with the community..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          rows={4}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <ImageIcon className="w-4 h-4 mr-1" />
                            Photo
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Hash className="w-4 h-4 mr-1" />
                            Topic
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => setShowNewPostForm(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitPost} disabled={!newPostContent.trim()}>
                            <Send className="w-4 h-4 mr-1" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNewPostForm(true)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {currentUser.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-500">Share your thoughts...</span>
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Mobile Category Filter */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {categories.map((cat) => (
                      <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-slate-100 text-slate-600">
                              {post.author.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-slate-900">{post.author.name}</span>
                              {post.author.verified && (
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-slate-500">{post.createdAt}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleBookmark(post.id)}>
                              <Bookmark className="w-4 h-4 mr-2" />
                              {post.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            'flex items-center gap-2 text-sm transition-colors',
                            post.liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                          )}
                        >
                          <Heart className={cn('w-5 h-5', post.liked && 'fill-current')} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600">
                          <MessageSquare className="w-5 h-5" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600">
                          <Share2 className="w-5 h-5" />
                          {post.shares}
                        </button>
                        <button
                          onClick={() => handleBookmark(post.id)}
                          className={cn(
                            'text-sm transition-colors',
                            post.bookmarked ? 'text-yellow-500' : 'text-slate-500 hover:text-yellow-500'
                          )}
                        >
                          <Bookmark className={cn('w-5 h-5', post.bookmarked && 'fill-current')} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                  <p>• Be respectful and kind to all members</p>
                  <p>• No hate speech or discrimination</p>
                  <p>• Keep discussions constructive</p>
                  <p>• Report inappropriate content</p>
                  <Link href="/community/guidelines" className="text-purple-600 hover:underline block mt-3">
                    Read full guidelines →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Oromo Parents', members: 1234 },
                    { name: 'Business Owners', members: 567 },
                    { name: 'Language Learners', members: 892 },
                  ].map((group, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{group.name}</p>
                        <p className="text-xs text-slate-500">{group.members.toLocaleString()} members</p>
                      </div>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
