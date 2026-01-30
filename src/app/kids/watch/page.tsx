'use client'

import Link from 'next/link'
import { Play, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function KidsWatchPage() {
  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Videos
          </h1>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Play className="w-16 h-16 text-white ml-2" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Coming Soon!
          </h2>

          <p className="text-xl text-slate-600 mb-6 max-w-md mx-auto">
            We&apos;re creating fun videos to help you learn Oromo!
            Check back soon for songs, stories, and more!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-2xl">🎵</span>
              <span className="text-blue-700 font-medium">Songs</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
              <span className="text-2xl">📚</span>
              <span className="text-purple-700 font-medium">Stories</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <span className="text-2xl">🎬</span>
              <span className="text-green-700 font-medium">Lessons</span>
            </div>
          </div>

          <p className="text-slate-500 mb-6">
            In the meantime, try our interactive courses!
          </p>

          <Button
            size="lg"
            className="text-lg px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            asChild
          >
            <Link href="/kids/courses">
              <BookOpen className="w-5 h-5 mr-2" />
              Go to Courses
            </Link>
          </Button>
        </div>

        {/* What to Expect Section */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-lg p-6 text-center text-white">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold mb-2">What&apos;s Coming</h3>
          <ul className="text-lg text-white/90 space-y-2">
            <li>Oromo alphabet songs</li>
            <li>Counting videos in Oromo</li>
            <li>Traditional Oromo stories</li>
            <li>Fun learning animations</li>
          </ul>
        </div>

        {/* Back Home */}
        <div className="mt-8 text-center">
          <Link
            href="/kids"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-slate-700 font-semibold hover:shadow-lg transition-all"
          >
            <span className="text-2xl">🏠</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
