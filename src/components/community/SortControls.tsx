'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Flame, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SortOption } from '@/types/community'

interface SortControlsProps {
  currentSort: SortOption
  baseUrl: string
}

const sortOptions: { value: SortOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'top', label: 'Top', icon: TrendingUp },
]

export function SortControls({ currentSort, baseUrl }: SortControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    params.delete('page') // Reset page when sorting changes
    router.push(`${baseUrl}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
      {sortOptions.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={currentSort === value ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleSort(value)}
          className={cn(
            'gap-1.5',
            currentSort === value && 'bg-background shadow-sm'
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  )
}
