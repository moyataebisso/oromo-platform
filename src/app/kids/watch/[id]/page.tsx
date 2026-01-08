'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Star, Play, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KidsVideoPlayer } from '@/components/kids/video-player'
import { cn } from '@/lib/utils'

// Mock video data (would come from database in production)
const videoData: Record<string, {
  id: string
  title: string
  description: string
  emoji: string
  category: string
  duration: string
  stars: number
  videoUrl: string
  words: Array<{ oromo: string; english: string; audio?: string }>
}> = {
  '1': {
    id: '1',
    title: 'Colors of the Rainbow',
    description: 'Learn all the beautiful colors in Oromo! Watch and repeat after the video to learn colors like red, blue, green, and more.',
    emoji: '🌈',
    category: 'colors',
    duration: '3:24',
    stars: 3,
    videoUrl: '/videos/kids/colors.mp4',
    words: [
      { oromo: 'Diimaa', english: 'Red' },
      { oromo: 'Cuquliisa', english: 'Blue' },
      { oromo: 'Magariisa', english: 'Green' },
      { oromo: 'Keelloo', english: 'Yellow' },
      { oromo: 'Burtukaana', english: 'Orange' },
      { oromo: 'Gurraacha', english: 'Black' },
      { oromo: 'Adii', english: 'White' },
    ],
  },
  '2': {
    id: '2',
    title: 'Animal Friends',
    description: 'Meet lions, elephants, and more animal friends! Learn what they are called in Oromo.',
    emoji: '🦁',
    category: 'animals',
    duration: '4:15',
    stars: 3,
    videoUrl: '/videos/kids/animals.mp4',
    words: [
      { oromo: 'Leenca', english: 'Lion' },
      { oromo: 'Arbaa', english: 'Elephant' },
      { oromo: 'Qeerramsa', english: 'Tiger' },
      { oromo: 'Adurree', english: 'Cat' },
      { oromo: 'Saree', english: 'Dog' },
    ],
  },
  '3': {
    id: '3',
    title: 'Counting 1 to 10',
    description: 'Count along with us in Oromo! Learn numbers from 1 to 10.',
    emoji: '🔢',
    category: 'numbers',
    duration: '2:45',
    stars: 3,
    videoUrl: '/videos/kids/counting.mp4',
    words: [
      { oromo: 'Tokko', english: 'One (1)' },
      { oromo: 'Lama', english: 'Two (2)' },
      { oromo: 'Sadii', english: 'Three (3)' },
      { oromo: 'Afur', english: 'Four (4)' },
      { oromo: 'Shan', english: 'Five (5)' },
      { oromo: 'Jaha', english: 'Six (6)' },
      { oromo: 'Torba', english: 'Seven (7)' },
      { oromo: 'Saddeet', english: 'Eight (8)' },
      { oromo: 'Sagal', english: 'Nine (9)' },
      { oromo: 'Kudhan', english: 'Ten (10)' },
    ],
  },
}

// Mock related videos
const relatedVideos = [
  { id: '4', title: 'The Alphabet Song', emoji: '🎵', duration: '3:30' },
  { id: '5', title: 'My Family', emoji: '👨‍👩‍👧‍👦', duration: '4:00' },
  { id: '6', title: 'Yummy Foods', emoji: '🍎', duration: '3:45' },
]

export default function KidsVideoPage() {
  const params = useParams()
  const videoId = params.id as string
  const [completed, setCompleted] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)

  const video = videoData[videoId] || videoData['1']

  const handleComplete = () => {
    setCompleted(true)
    setEarnedStars(video.stars)
  }

  return (
    <div className="py-6 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="ghost" size="lg" className="text-lg" asChild>
            <Link href="/kids/watch">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Videos
            </Link>
          </Button>
        </div>

        {/* Video Player */}
        <div className="mb-6">
          <KidsVideoPlayer
            videoUrl={video.videoUrl}
            title={video.title}
            onComplete={handleComplete}
          />
        </div>

        {/* Video Info */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-4xl">{video.emoji}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                  {video.title}
                </h1>
              </div>
              <p className="text-slate-600 text-lg">{video.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-4 py-2 bg-slate-100 rounded-full">
                <Clock className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-slate-700">{video.duration}</span>
              </div>
              <div className="flex items-center gap-1 px-4 py-2 bg-yellow-100 rounded-full">
                {Array.from({ length: video.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      completed ? 'text-yellow-500' : 'text-yellow-300'
                    )}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Completion Banner */}
          {completed && (
            <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">Great job watching!</p>
                  <p>You earned {earnedStars} stars!</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: earnedStars }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-8 h-8 text-yellow-300 animate-pulse"
                    fill="currentColor"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Words Learned */}
        {video.words && video.words.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>📖</span> Words in this video
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {video.words.map((word, i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl text-center hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <p className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {word.oromo}
                  </p>
                  <p className="text-slate-500">{word.english}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More Videos */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🎬</span> Watch More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedVideos.map((relatedVideo) => (
              <Link
                key={relatedVideo.id}
                href={`/kids/watch/${relatedVideo.id}`}
                className="group flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {relatedVideo.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {relatedVideo.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    {relatedVideo.duration}
                  </div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-blue-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
