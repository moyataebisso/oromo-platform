'use client'

import { useState, useEffect } from 'react'
import { List, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const [tocItems, setTocItems] = useState<TOCItem[]>([])

  // Parse headings from content
  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2]
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      items.push({ id, title, level })
    }

    setTocItems(items)
    if (items.length > 0) {
      setActiveId(items[0].id)
    }
  }, [content])

  // Track scroll position and update active heading
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = tocItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id) || document.querySelector(`[id*="${item.id}"]`)
      })).filter(item => item.element)

      const scrollPosition = window.scrollY + 150 // Offset for header

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id) || document.querySelector(`[id*="${id}"]`)
    if (element) {
      const offset = 100 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setActiveId(id)
    }
  }

  if (tocItems.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <List className="w-4 h-4" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={cn(
                'w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200 flex items-center gap-1',
                item.level === 3 && 'pl-4',
                activeId === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {activeId === item.id && (
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
              )}
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </nav>

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Reading progress</span>
            <span>
              {Math.round(((tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${((tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length) * 100}%`
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
