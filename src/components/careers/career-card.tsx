import Link from 'next/link'
import { TrendingUp, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CareerCardProps {
  career: {
    id: string
    slug: string
    title: string
    category: string
    description?: string
    salary_min?: number
    salary_max?: number
    job_outlook?: string
  }
}

const categoryColors: Record<string, string> = {
  technology: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  healthcare: 'bg-green-500/20 text-green-400 border-green-500/30',
  business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  education: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  engineering: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  creative: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  legal: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Varies'
  const formatK = (n: number) => `$${Math.round(n / 1000)}K`
  if (min && max) return `${formatK(min)} - ${formatK(max)}`
  if (min) return `From ${formatK(min)}`
  return `Up to ${formatK(max!)}`
}

export function CareerCard({ career }: CareerCardProps) {
  const colorClass = categoryColors[career.category?.toLowerCase()] || 'bg-secondary text-muted-foreground border-border'

  return (
    <Link
      href={`/careers/${career.slug}`}
      className="block bg-card rounded-xl border border-border p-6 transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
          {career.title}
        </h3>
        <Badge variant="outline" className={`capitalize text-xs ${colorClass}`}>
          {career.category}
        </Badge>
      </div>

      {career.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {career.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>{formatSalary(career.salary_min, career.salary_max)}</span>
        </div>
        {career.job_outlook && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>{career.job_outlook}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
