import Link from 'next/link'
import { TrendingUp, DollarSign, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MajorCardProps {
  major: {
    id: string
    slug: string
    name: string
    category: string
    career_paths?: string
    salary_range?: string
    job_outlook?: string
  }
}

const categoryColors: Record<string, string> = {
  stem: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  healthcare: 'bg-green-500/20 text-green-400 border-green-500/30',
  'arts & humanities': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export function MajorCard({ major }: MajorCardProps) {
  const colorClass = categoryColors[major.category?.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'

  return (
    <Link
      href={`/careers/majors/${major.slug}`}
      className="block bg-slate-800 rounded-xl border border-slate-700 p-6 transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-lg group-hover:text-primary transition-colors">
          {major.name}
        </h3>
        <Badge variant="outline" className={`capitalize text-xs ${colorClass}`}>
          {major.category}
        </Badge>
      </div>

      {major.career_paths && (
        <div className="flex items-start gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-slate-400 text-sm line-clamp-1">
            {major.career_paths}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        {major.salary_range && (
          <div className="flex items-center gap-1 text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span>{major.salary_range}</span>
          </div>
        )}
        {major.job_outlook && (
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>{major.job_outlook}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
