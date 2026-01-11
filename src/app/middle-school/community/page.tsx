'use client'

import Link from 'next/link'
import { Users, MessageCircle, Trophy, Star, ArrowRight } from 'lucide-react'

export default function MiddleSchoolCommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Community</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Connect with other students, share your progress, and learn together!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Coming Soon Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Discussion Forums</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ask questions, share tips, and help other students with their learning.
            </p>
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              Coming Soon
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Leaderboards</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Compete with friends and see who can earn the most XP!
            </p>
            <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
              Coming Soon
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Achievements</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unlock badges and achievements as you complete courses and challenges.
            </p>
            <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
              Coming Soon
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Study Groups</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Form study groups with classmates and learn together.
            </p>
            <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
              Coming Soon
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Start Learning Today!</h3>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            While we build the community features, start earning XP by completing courses!
          </p>
          <Link
            href="/middle-school/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
