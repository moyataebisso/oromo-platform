'use client'

import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewsCard } from './news-card'
import { NewsItem } from '@/types/news'

// Mock news data
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Oromo Cultural Festival Returns to Minneapolis with Record Attendance Expected',
    excerpt: 'The annual celebration of Oromo heritage and culture is set to draw thousands of visitors this weekend with traditional music, food, and performances.',
    content: null,
    source_name: 'Oromo Tribune',
    source_logo_url: null,
    source_url: '#',
    image_url: null,
    category: 'community',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Young Oromo Entrepreneur Launches Tech Startup in Silicon Valley',
    excerpt: 'Bekele Tadesse, 28, has raised $5 million in seed funding for his AI-powered language learning app focused on African languages.',
    content: null,
    source_name: 'Business Daily',
    source_logo_url: null,
    source_url: '#',
    image_url: null,
    category: 'business',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'UNESCO Recognizes Gadaa System as Masterpiece of Oral Heritage',
    excerpt: 'The ancient Oromo democratic governance system receives renewed international recognition for its sophisticated political and social organization.',
    content: null,
    source_name: 'World News',
    source_logo_url: null,
    source_url: '#',
    image_url: null,
    category: 'culture',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Oromo Runners Dominate at International Marathon Championship',
    excerpt: 'Athletes from the Oromo region swept the podium at this year\'s world marathon championship, continuing a proud tradition of excellence.',
    content: null,
    source_name: 'Sports Weekly',
    source_logo_url: null,
    source_url: '#',
    image_url: null,
    category: 'sports',
    published_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

export const NewsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Latest News
              </h2>
              <p className="text-slate-600">
                Stay informed with news from the Oromo community
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/wiki/news">
              View All News
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/wiki/news">
              View All News
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
