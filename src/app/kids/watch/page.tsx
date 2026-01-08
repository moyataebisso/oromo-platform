'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Star, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock video data
const videos = [
  {
    id: '1',
    title: 'Colors of the Rainbow',
    description: 'Learn all the beautiful colors in Oromo!',
    thumbnailUrl: null,
    emoji: '🌈',
    category: 'colors',
    duration: '3:24',
    progress: 75,
    completed: false,
    stars: 3,
  },
  {
    id: '2',
    title: 'Animal Friends',
    description: 'Meet lions, elephants, and more animal friends!',
    thumbnailUrl: null,
    emoji: '🦁',
    category: 'animals',
    duration: '4:15',
    progress: 100,
    completed: true,
    stars: 3,
  },
  {
    id: '3',
    title: 'Counting 1 to 10',
    description: 'Count along with us in Oromo!',
    thumbnailUrl: null,
    emoji: '🔢',
    category: 'numbers',
    duration: '2:45',
    progress: 90,
    completed: true,
    stars: 3,
  },
  {
    id: '4',
    title: 'The Alphabet Song',
    description: 'Learn the Qubee alphabet with a fun song!',
    thumbnailUrl: null,
    emoji: '🎵',
    category: 'alphabet',
    duration: '3:30',
    progress: 0,
    completed: false,
    stars: 3,
  },
  {
    id: '5',
    title: 'My Family',
    description: 'Words for mom, dad, sister, brother, and more!',
    thumbnailUrl: null,
    emoji: '👨‍👩‍👧‍👦',
    category: 'family',
    duration: '4:00',
    progress: 30,
    completed: false,
    stars: 3,
  },
  {
    id: '6',
    title: 'Yummy Foods',
    description: 'Learn the names of delicious Oromo foods!',
    thumbnailUrl: null,
    emoji: '🍎',
    category: 'food',
    duration: '3:45',
    progress: 0,
    completed: false,
    stars: 3,
  },
  {
    id: '7',
    title: 'Counting 11 to 20',
    description: 'Keep counting higher in Oromo!',
    thumbnailUrl: null,
    emoji: '🔢',
    category: 'numbers',
    duration: '3:15',
    progress: 0,
    completed: false,
    stars: 3,
  },
  {
    id: '8',
    title: 'Farm Animals',
    description: 'Visit the farm and meet cows, chickens, and goats!',
    thumbnailUrl: null,
    emoji: '🐄',
    category: 'animals',
    duration: '4:30',
    progress: 0,
    completed: false,
    stars: 3,
  },
  {
    id: '9',
    title: 'The Story of the Lion',
    description: 'A fun Oromo story about a brave lion!',
    thumbnailUrl: null,
    emoji: '📚',
    category: 'stories',
    duration: '5:00',
    progress: 0,
    completed: false,
    stars: 5,
  },
]

const categories = [
  { id: 'all', name: 'All', emoji: '✨' },
  { id: 'colors', name: 'Colors', emoji: '🌈' },
  { id: 'animals', name: 'Animals', emoji: '🦁' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢' },
  { id: 'alphabet', name: 'Qubee', emoji: '📝' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'food', name: 'Food', emoji: '🍎' },
  { id: 'stories', name: 'Stories', emoji: '📚' },
]

export default function KidsWatchPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory)

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Watch & Learn 📺
          </h1>
          <p className="text-xl text-slate-600">
            Fun videos to help you learn Oromo!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="lg"
              className={cn(
                'text-lg font-semibold rounded-full',
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : ''
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/kids/watch/${video.id}`}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-400 to-purple-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl">{video.emoji}</span>
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-xl">
                    <Play className="w-8 h-8 text-blue-500 ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-white text-sm font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
                {/* Completed Badge */}
                {video.completed && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                {/* Stars & Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: video.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          video.completed ? 'text-yellow-400' : 'text-slate-300'
                        )}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  {video.progress > 0 && !video.completed && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{video.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No videos yet!</h3>
            <p className="text-slate-600">Check back soon for more fun videos!</p>
          </div>
        )}
      </div>
    </div>
  )
}
