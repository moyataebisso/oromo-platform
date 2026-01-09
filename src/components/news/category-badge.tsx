import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
}

const categoryStyles: Record<string, string> = {
  breaking: 'bg-red-500/20 text-red-400 border-red-500/30',
  politics: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  culture: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  sports: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  diaspora: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  education: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  community: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const style = categoryStyles[category.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'

  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium border capitalize',
        style,
        className
      )}
    >
      {category}
    </span>
  )
}
