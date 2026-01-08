'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  Shield,
  Eye,
  Settings,
  TrendingUp,
  Calendar,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  ArrowLeft,
  Star,
  Video,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Mock child data
const childData = {
  name: 'Bekele Jr.',
  avatar: '👦',
  age: 8,
  lastActive: '2 hours ago',
  todayScreenTime: 45, // minutes
  dailyLimit: 60, // minutes
  weeklyProgress: {
    monday: 40,
    tuesday: 55,
    wednesday: 30,
    thursday: 45,
    friday: 50,
    saturday: 60,
    sunday: 35,
  },
  stats: {
    totalStars: 47,
    lessonsCompleted: 12,
    videosWatched: 23,
    currentStreak: 5,
  },
}

// Mock watch history
const watchHistory = [
  { id: '1', title: 'Colors of the Rainbow', emoji: '🌈', watchedAt: '2 hours ago', duration: '3:24', completed: true },
  { id: '2', title: 'Animal Friends', emoji: '🦁', watchedAt: 'Yesterday', duration: '4:15', completed: true },
  { id: '3', title: 'Counting 1 to 10', emoji: '🔢', watchedAt: 'Yesterday', duration: '2:45', completed: false },
  { id: '4', title: 'The Alphabet Song', emoji: '🎵', watchedAt: '2 days ago', duration: '3:30', completed: true },
  { id: '5', title: 'My Family', emoji: '👨‍👩‍👧‍👦', watchedAt: '3 days ago', duration: '4:00', completed: true },
]

// Mock content approval requests (if any)
const pendingApprovals = [
  { id: '1', type: 'video', title: 'Advanced Numbers', requestedAt: 'Today', reason: 'Parent-only content requested' },
]

export default function ParentDashboardPage() {
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [settingsUnlocked, setSettingsUnlocked] = useState(false)
  const [dailyLimit, setDailyLimit] = useState(childData.dailyLimit)

  const handlePinSubmit = () => {
    // In production, verify PIN against stored value
    if (pin === '1234') {
      setSettingsUnlocked(true)
      setShowPinModal(false)
      setPin('')
    } else {
      alert('Incorrect PIN')
    }
  }

  const screenTimePercentage = (childData.todayScreenTime / dailyLimit) * 100

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
          {/* Child Profile Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl">
                {childData.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{childData.name}</h1>
                <p className="text-slate-600">Age {childData.age} • Last active: {childData.lastActive}</p>
              </div>
              <div className="ml-auto flex flex-wrap gap-4">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-yellow-600">{childData.stats.totalStars}</p>
                  <p className="text-sm text-slate-500">Stars</p>
                </div>
                <div className="text-center px-4 border-l">
                  <p className="text-2xl font-bold text-green-600">{childData.stats.lessonsCompleted}</p>
                  <p className="text-sm text-slate-500">Lessons</p>
                </div>
                <div className="text-center px-4 border-l">
                  <p className="text-2xl font-bold text-blue-600">{childData.stats.videosWatched}</p>
                  <p className="text-sm text-slate-500">Videos</p>
                </div>
                <div className="text-center px-4 border-l">
                  <p className="text-2xl font-bold text-orange-600">{childData.stats.currentStreak}</p>
                  <p className="text-sm text-slate-500">Day Streak</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Screen Time & Settings */}
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
                          strokeDasharray={`${screenTimePercentage * 3.52} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900">{childData.todayScreenTime}</span>
                        <span className="text-sm text-slate-500">minutes</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-2">
                        Daily Limit: <span className="font-bold text-slate-900">{dailyLimit} minutes</span>
                      </p>
                      <p className="text-slate-600">
                        Remaining: <span className="font-bold text-green-600">{dailyLimit - childData.todayScreenTime} minutes</span>
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
                      {Object.entries(childData.weeklyProgress).map(([day, minutes]) => (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              'w-full rounded-t-md',
                              minutes > dailyLimit ? 'bg-red-400' : 'bg-blue-400'
                            )}
                            style={{ height: `${(minutes / dailyLimit) * 100}%`, maxHeight: '100%' }}
                          />
                          <span className="text-xs text-slate-500 uppercase">{day.slice(0, 2)}</span>
                        </div>
                      ))}
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
                    {watchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                          {item.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.title}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{item.watchedAt}</span>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
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

            {/* Right Column - Settings & Approvals */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-slate-700">Total Stars</span>
                    </div>
                    <span className="font-bold text-lg text-slate-900">{childData.stats.totalStars}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-slate-700">Lessons Done</span>
                    </div>
                    <span className="font-bold text-lg text-slate-900">{childData.stats.lessonsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-slate-700">Videos Watched</span>
                    </div>
                    <span className="font-bold text-lg text-slate-900">{childData.stats.videosWatched}</span>
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

              {/* Pending Approvals */}
              {pendingApprovals.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="w-5 h-5" />
                      Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingApprovals.map((approval) => (
                      <div key={approval.id} className="p-3 bg-white rounded-lg mb-2">
                        <p className="font-medium text-slate-900">{approval.title}</p>
                        <p className="text-sm text-slate-500">{approval.reason}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1">Approve</Button>
                          <Button size="sm" variant="outline" className="flex-1">Deny</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
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
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="text-center text-2xl tracking-widest mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPinModal(false)
                  setPin('')
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePinSubmit}
                disabled={pin.length !== 4}
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
    </div>
  )
}
