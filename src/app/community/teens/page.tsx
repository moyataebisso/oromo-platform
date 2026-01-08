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
  Flag,
  Bookmark,
  GraduationCap,
  Trophy,
  Sparkles,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Mock current user
const currentUser = {
  id: '1',
  name: 'Amina',
  initials: 'A',
  grade: '11',
  points: 450,
}

// Mock posts for teens
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Mohamed A.',
      initials: 'M',
      grade: '12',
      badge: 'senior',
    },
    content: 'Just got accepted to my dream college! 🎉 All those late nights studying paid off. Never give up on your goals!',
    likes: 156,
    comments: 34,
    createdAt: '2 hours ago',
    topic: 'college',
    liked: true,
  },
  {
    id: '2',
    author: {
      name: 'Sara T.',
      initials: 'S',
      grade: '11',
      badge: null,
    },
    content: 'Anyone have tips for the AP History exam? I\'m struggling with the essay portion. Would love to form a study group!',
    likes: 45,
    comments: 23,
    createdAt: '4 hours ago',
    topic: 'academics',
    liked: false,
  },
  {
    id: '3',
    author: {
      name: 'Teen Mentor',
      initials: 'TM',
      grade: null,
      badge: 'mentor',
    },
    content: '📚 SAT Tip of the Day: Practice with real test conditions! Set a timer, no breaks, no phone. Your practice score will be more accurate and you\'ll be better prepared.',
    likes: 89,
    comments: 12,
    createdAt: '6 hours ago',
    topic: 'tips',
    liked: false,
  },
  {
    id: '4',
    author: {
      name: 'Fatima H.',
      initials: 'F',
      grade: '10',
      badge: null,
    },
    content: 'Started the Oromo language course today and it\'s amazing how much I\'ve forgotten since I was little. My grandparents will be so happy when I can speak with them better!',
    likes: 112,
    comments: 28,
    createdAt: '8 hours ago',
    topic: 'culture',
    liked: true,
  },
]

// Topics/categories for teens
const topics = [
  { id: 'all', name: 'All Posts', emoji: '✨' },
  { id: 'college', name: 'College Talk', emoji: '🎓' },
  { id: 'academics', name: 'Academics', emoji: '📚' },
  { id: 'culture', name: 'Our Culture', emoji: '🌍' },
  { id: 'tips', name: 'Tips & Advice', emoji: '💡' },
  { id: 'fun', name: 'Fun & Games', emoji: '🎮' },
]

// Trending in teen community
const trending = [
  { tag: 'CollegeAcceptance', posts: 89 },
  { tag: 'StudyTips', posts: 67 },
  { tag: 'SATPrep', posts: 56 },
  { tag: 'OromoYouth', posts: 45 },
]

// Leaderboard
const leaderboard = [
  { name: 'Mohamed A.', points: 1250, rank: 1 },
  { name: 'Sara T.', points: 980, rank: 2 },
  { name: 'Ahmed K.', points: 875, rank: 3 },
]

export default function TeenCommunityPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [showNewPost, setShowNewPost] = useState(false)

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return

    const newPost = {
      id: Date.now().toString(),
      author: {
        name: currentUser.name,
        initials: currentUser.initials,
        grade: currentUser.grade,
        badge: null,
      },
      content: newPostContent,
      likes: 0,
      comments: 0,
      createdAt: 'Just now',
      topic: 'general',
      liked: false,
    }

    setPosts([newPost, ...posts])
    setNewPostContent('')
    setShowNewPost(false)
  }

  const filteredPosts = selectedTopic === 'all'
    ? posts
    : posts.filter(post => post.topic === selectedTopic)

  const getBadgeStyle = (badge: string | null) => {
    switch (badge) {
      case 'senior':
        return 'bg-blue-100 text-blue-700'
      case 'mentor':
        return 'bg-purple-100 text-purple-700'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/teens" className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900">Oromo</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Teens
                </span>
              </Link>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-slate-900">Community</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">{currentUser.points} points</span>
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Moderation Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-center gap-2 text-sm">
          <Shield className="w-4 h-4" />
          <span>This is a safe, moderated space for Oromo teens</span>
        </div>
      </div>

      <main className="py-6 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                        selectedTopic === topic.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      <span>{topic.emoji}</span>
                      {topic.name}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Trending */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {trending.map((item, i) => (
                    <Link
                      key={i}
                      href="#"
                      className="flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 py-1.5 rounded"
                    >
                      <span className="text-sm font-medium text-purple-600">#{item.tag}</span>
                      <span className="text-xs text-slate-400">{item.posts}</span>
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
                  {showNewPost ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {currentUser.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="What's on your mind?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            rows={3}
                            className="mb-2"
                          />
                          <p className="text-xs text-slate-500 mb-3">
                            Remember: Be kind and respectful. All posts are reviewed by moderators.
                          </p>
                        </div>
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
                          <Button variant="ghost" onClick={() => setShowNewPost(false)}>
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
                      onClick={() => setShowNewPost(true)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {currentUser.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-500">Share something with fellow teens...</span>
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Mobile Topic Filter */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {topics.find(t => t.id === selectedTopic)?.emoji}{' '}
                      {topics.find(t => t.id === selectedTopic)?.name}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {topics.map((topic) => (
                      <DropdownMenuItem key={topic.id} onClick={() => setSelectedTopic(topic.id)}>
                        {topic.emoji} {topic.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="pt-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                              {post.author.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{post.author.name}</span>
                              {post.author.badge && (
                                <span className={cn(
                                  'text-xs px-2 py-0.5 rounded-full font-medium',
                                  getBadgeStyle(post.author.badge)
                                )}>
                                  {post.author.badge === 'mentor' ? '🌟 Mentor' : '🎓 Senior'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              {post.author.grade && <span>Grade {post.author.grade}</span>}
                              <span>•</span>
                              <span>{post.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bookmark className="w-4 h-4 mr-2" />
                              Save
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pt-3 border-t">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            'flex items-center gap-2 text-sm transition-colors',
                            post.liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                          )}
                        >
                          <Heart className={cn('w-5 h-5', post.liked && 'fill-current')} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600">
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600">
                          <Share2 className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Leaderboard */}
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leaderboard.map((user, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        i === 0 ? 'bg-yellow-400 text-yellow-900' :
                        i === 1 ? 'bg-slate-300 text-slate-700' :
                        'bg-amber-200 text-amber-800'
                      )}>
                        {user.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.points} points</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    View Full Leaderboard
                  </Button>
                </CardContent>
              </Card>

              {/* College Prep Promo */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <GraduationCap className="w-10 h-10 mb-3" />
                  <h3 className="font-bold text-lg mb-2">College Prep</h3>
                  <p className="text-white/80 text-sm mb-4">
                    SAT prep, scholarships, and essay help - all in one place!
                  </p>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href="/teens/college-prep">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Community Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                  <p>• Be kind and supportive</p>
                  <p>• No bullying or harassment</p>
                  <p>• Keep content school-appropriate</p>
                  <p>• Respect everyone&apos;s privacy</p>
                  <p className="text-xs text-slate-400 mt-3">
                    All posts are reviewed by moderators
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
