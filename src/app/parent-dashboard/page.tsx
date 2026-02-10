'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Clock,
  Shield,
  Eye,
  Settings,
  TrendingUp,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  ArrowLeft,
  Star,
  BookOpen,
  Loader2,
  Plus,
  BarChart3,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface KidProfile {
  id: string
  name: string
  avatar_url: string | null
  age: number
  screen_time_limit: number
  last_active_at: string | null
}

interface ScreenTime {
  date: string
  minutes_used: number
}

export default function ParentDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [children, setChildren] = useState<KidProfile[]>([])
  const [selectedChild, setSelectedChild] = useState<KidProfile | null>(null)
  const [screenTime, setScreenTime] = useState<ScreenTime[]>([])
  const [todayScreenTime, setTodayScreenTime] = useState(0)
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalStars: 0,
    lessonsCompleted: 0,
    videosWatched: 0,
    dayStreak: 0,
  })

  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [settingsUnlocked, setSettingsUnlocked] = useState(false)
  const [dailyLimit, setDailyLimit] = useState(60)

  // Add Child Modal State
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [addingChild, setAddingChild] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkAuthAndFetchData()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild.id)
      setDailyLimit(selectedChild.screen_time_limit || 60)
    }
  }, [selectedChild])

  const checkAuthAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login?redirect=/parent-dashboard')
      return
    }

    setUser(user)

    // Try to fetch children profiles
    try {
      const { data: kids, error } = await supabase
        .from('kids_profiles')
        .select('*')
        .eq('parent_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (kids && kids.length > 0) {
        setChildren(kids)
        setSelectedChild(kids[0])
      }
    } catch (err) {
      console.log('Kids profiles table may not exist yet')
    }

    setLoading(false)
  }

  const fetchChildData = async (kidId: string) => {
    try {
      // Fetch today's screen time
      const today = new Date().toISOString().split('T')[0]
      const { data: todayTime } = await supabase
        .from('kids_screen_time')
        .select('minutes_used')
        .eq('kid_profile_id', kidId)
        .eq('date', today)
        .single() as { data: { minutes_used: number } | null }

      setTodayScreenTime(todayTime?.minutes_used || 0)

      // Fetch weekly screen time
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { data: weeklyTime } = await supabase
        .from('kids_screen_time')
        .select('date, minutes_used')
        .eq('kid_profile_id', kidId)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .order('date', { ascending: true }) as { data: { date: string; minutes_used: number }[] | null }

      setScreenTime(weeklyTime || [])

      // Fetch watch history
      const { data: history } = await supabase
        .from('kids_watch_history')
        .select(`
          id,
          watched_at,
          duration_watched,
          completed,
          video:kids_videos(title, thumbnail_url)
        `)
        .eq('kid_profile_id', kidId)
        .order('watched_at', { ascending: false })
        .limit(10)

      setWatchHistory(history || [])

      // Calculate stats
      const { count: lessonsCount } = await supabase
        .from('kids_progress')
        .select('*', { count: 'exact', head: true })
        .eq('kid_profile_id', kidId)
        .eq('completed', true)

      const { count: videosCount } = await supabase
        .from('kids_watch_history')
        .select('*', { count: 'exact', head: true })
        .eq('kid_profile_id', kidId)
        .eq('completed', true)

      // Calculate stars (10 per lesson, 5 per video)
      const totalStars = ((lessonsCount || 0) * 10) + ((videosCount || 0) * 5)

      // Calculate day streak
      let streak = 0
      if (weeklyTime && weeklyTime.length > 0) {
        const sortedDays = [...weeklyTime].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        for (const day of sortedDays) {
          if (day.minutes_used > 0) streak++
          else break
        }
      }

      setStats({
        totalStars,
        lessonsCompleted: lessonsCount || 0,
        videosWatched: videosCount || 0,
        dayStreak: streak,
      })
    } catch (err) {
      console.log('Error fetching child data:', err)
    }
  }

  const handlePinSubmit = () => {
    if (pin === '1234' || pin.length === 4) {
      setSettingsUnlocked(true)
      setShowPinModal(false)
      setPin('')
      setPinError('')
    } else {
      setPinError('Please enter a 4-digit PIN')
    }
  }

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddChild = async () => {
    if (!newChildName || !newChildAge || !user) return

    setAddingChild(true)

    try {
      const { data, error } = await supabase
        .from('kids_profiles')
        .insert({
          parent_id: user.id,
          name: newChildName.trim(),
          age: parseInt(newChildAge),
          screen_time_limit: 60,
          is_active: true
        } as never)
        .select()
        .single()

      if (error) {
        console.error('Error adding child:', error)
        alert('Failed to add child. Please try again.')
      } else if (data) {
        // Refresh children list
        setChildren([...children, data as KidProfile])
        setSelectedChild(data as KidProfile)
        setShowAddChildModal(false)
        setNewChildName('')
        setNewChildAge('')
      }
    } catch (err) {
      console.error('Error adding child:', err)
      alert('Failed to add child. Please try again.')
    }

    setAddingChild(false)
  }

  const screenTimePercentage = (todayScreenTime / dailyLimit) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Use demo data if no real children exist
  const hasRealData = children.length > 0
  const displayChild = selectedChild || {
    id: 'demo',
    name: 'Demo Child',
    avatar_url: null,
    age: 7,
    screen_time_limit: 60,
    last_active_at: new Date().toISOString(),
  }
  const displayStats = hasRealData ? stats : {
    totalStars: 47,
    lessonsCompleted: 12,
    videosWatched: 23,
    dayStreak: 5,
  }
  const displayScreenTime = hasRealData ? todayScreenTime : 45
  const displayWatchHistory = hasRealData ? watchHistory : [
    { id: '1', title: 'Colors of the Rainbow', emoji: '🌈', watchedAt: '2 hours ago', duration: '3:24', completed: true },
    { id: '2', title: 'Animal Friends', emoji: '🦁', watchedAt: 'Yesterday', duration: '4:15', completed: true },
    { id: '3', title: 'Counting 1 to 10', emoji: '🔢', watchedAt: 'Yesterday', duration: '2:45', completed: false },
    { id: '4', title: 'The Alphabet Song', emoji: '🎵', watchedAt: '2 days ago', duration: '3:30', completed: true },
    { id: '5', title: 'My Family', emoji: '👨‍👩‍👧‍👦', watchedAt: '3 days ago', duration: '4:00', completed: true },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-slate-900">Parent Dashboard</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPinModal(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              {settingsUnlocked ? 'Settings Unlocked' : 'Unlock Settings'}
            </Button>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Demo Mode Banner */}
          {!hasRealData && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Demo Mode</p>
                  <p className="text-sm text-blue-700">Add your child&apos;s profile to see real data</p>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddChildModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </div>
          )}

          {/* Child Profile Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl">
                {displayChild.avatar_url ? (
                  <img src={displayChild.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  '👦'
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{displayChild.name}</h1>
                <p className="text-slate-600">
                  Age {displayChild.age} • Last active: {formatTimeAgo(displayChild.last_active_at)}
                </p>
              </div>
              <div className="ml-auto flex flex-wrap gap-4">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-yellow-600">{displayStats.totalStars}</p>
                  <p className="text-sm text-slate-500">Stars</p>
                </div>
                <div className="text-center px-4 border-l">
                  <p className="text-2xl font-bold text-green-600">{displayStats.lessonsCompleted}</p>
                  <p className="text-sm text-slate-500">Lessons</p>
                </div>
                <div className="text-center px-4 border-l">
                  <p className="text-2xl font-bold text-blue-600">{displayStats.videosWatched}</p>
                  <p className="text-sm text-slate-500">Videos</p>
                </div>
                <div className="text-center px-4 border-l">
                  <p className="text-2xl font-bold text-orange-600">{displayStats.dayStreak}</p>
                  <p className="text-sm text-slate-500">Day Streak</p>
                </div>
              </div>
            </div>

            {/* Child selector if multiple children */}
            {children.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition',
                        selectedChild?.id === child.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Screen Time & Watch History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Screen Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Today&apos;s Screen Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8 mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke={screenTimePercentage > 90 ? '#ef4444' : screenTimePercentage > 70 ? '#f59e0b' : '#22c55e'}
                          strokeWidth="12"
                          strokeDasharray={`${Math.min(screenTimePercentage, 100) * 3.52} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900">{displayScreenTime}</span>
                        <span className="text-sm text-slate-500">minutes</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-2">
                        Daily Limit: <span className="font-bold text-slate-900">{dailyLimit} minutes</span>
                      </p>
                      <p className="text-slate-600">
                        Remaining: <span className={cn(
                          'font-bold',
                          (dailyLimit - displayScreenTime) <= 15 ? 'text-red-600' : 'text-green-600'
                        )}>
                          {Math.max(0, dailyLimit - displayScreenTime)} minutes
                        </span>
                      </p>
                      {screenTimePercentage > 90 && (
                        <div className="mt-2 flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Almost at daily limit!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weekly Chart */}
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">This Week</h4>
                    <div className="flex items-end gap-2 h-24">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => {
                        const dayData = screenTime.find(st => {
                          const d = new Date(st.date)
                          return d.getDay() === (i + 1) % 7
                        })
                        const minutes = dayData?.minutes_used || (hasRealData ? 0 : [40, 55, 30, 45, 50, 60, 35][i])
                        const height = Math.min(100, (minutes / dailyLimit) * 100)

                        return (
                          <div key={day} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className={cn(
                                'w-full rounded-t-md',
                                minutes > dailyLimit ? 'bg-red-400' : 'bg-blue-400'
                              )}
                              style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                            />
                            <span className="text-xs text-slate-500">{day}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Watch History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Watch History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayWatchHistory.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                          {item.emoji || <Play className="w-6 h-6 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.video?.title || item.title}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{item.watchedAt || formatTimeAgo(item.watched_at)}</span>
                            <span>{item.duration || formatDuration(item.duration_watched || 0)}</span>
                          </div>
                        </div>
                        {item.completed ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">In progress</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & Progress */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-slate-700">Total Stars</span>
                    </div>
                    <span className="font-bold text-lg text-slate-900">{displayStats.totalStars}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-slate-700">Lessons Done</span>
                    </div>
                    <span className="font-bold text-lg text-slate-900">{displayStats.lessonsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-slate-700">Videos Watched</span>
                    </div>
                    <span className="font-bold text-lg text-slate-900">{displayStats.videosWatched}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Parental Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-600" />
                    Parental Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {settingsUnlocked ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dailyLimit">Daily Screen Time Limit (minutes)</Label>
                        <Input
                          id="dailyLimit"
                          type="number"
                          value={dailyLimit}
                          onChange={(e) => setDailyLimit(Number(e.target.value))}
                          min={15}
                          max={180}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content Filters</Label>
                        <div className="space-y-2">
                          {['Videos', 'Games', 'Stories', 'Songs'].map((content) => (
                            <label key={content} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm text-slate-700">{content}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">Save Settings</Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600 mb-4">
                        Enter your PIN to access parental controls
                      </p>
                      <Button onClick={() => setShowPinModal(true)}>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Settings
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Enter PIN</h2>
            <p className="text-slate-600 text-center mb-6">Enter your 4-digit PIN to access settings</p>
            <Input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="text-center text-2xl tracking-widest mb-4"
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm text-center mb-4">{pinError}</p>}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPinModal(false)
                  setPin('')
                  setPinError('')
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePinSubmit}
              >
                Unlock
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-4">
              Demo PIN: 1234
            </p>
          </div>
        </div>
      )}

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Child Profile</h3>
            <p className="text-gray-500 mb-6">Create a profile to track your child&apos;s learning progress</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child&apos;s Name</label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <select
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select age</option>
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(age => (
                    <option key={age} value={age}>{age} years old</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddChildModal(false)
                  setNewChildName('')
                  setNewChildAge('')
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={addingChild || !newChildName || !newChildAge}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
              >
                {addingChild ? 'Adding...' : 'Add Child'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
