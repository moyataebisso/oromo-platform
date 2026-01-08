'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft, BookOpen, Briefcase, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-slate-200 select-none leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent text-6xl md:text-7xl font-bold">
              Oops!
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/academy">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Academy</h3>
                <p className="text-sm text-slate-500 mt-1">Learn and grow</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/careers">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Careers</h3>
                <p className="text-sm text-slate-500 mt-1">Find opportunities</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/wiki">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-200 transition-colors">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Wiki</h3>
                <p className="text-sm text-slate-500 mt-1">Explore knowledge</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-white/50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Search className="w-5 h-5" />
            <span>Try searching for what you need</span>
          </div>
        </div>
      </div>
    </div>
  )
}
