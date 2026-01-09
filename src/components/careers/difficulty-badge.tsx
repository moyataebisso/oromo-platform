import { cn } from '@/lib/utils'

interface DifficultyBadgeProps {
  difficulty: string
  className?: string
}

const difficultyStyles: Record<string, string> = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-red-500/20 text-red-400',
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const style = difficultyStyles[difficulty.toLowerCase()] || 'bg-slate-500/20 text-slate-400'

  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        style,
        className
      )}
    >
      {difficulty}
    </span>
  )
}
