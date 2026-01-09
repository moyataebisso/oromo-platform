import Link from 'next/link'
import { MapPin, Clock, DollarSign, Building2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Job } from '@/types/careers'

interface JobCardProps {
  job: Job
  className?: string
}

const jobTypeColors = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-blue-100 text-blue-700',
  'contract': 'bg-purple-100 text-purple-700',
  'internship': 'bg-orange-100 text-orange-700',
}

const formatSalary = (min: number | null, max: number | null): string => {
  if (!min && !max) return 'Competitive'
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  if (min) return `From $${min.toLocaleString()}`
  if (max) return `Up to $${max.toLocaleString()}`
  return 'Competitive'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export const JobCard = ({ job, className }: JobCardProps) => {
  return (
    <Card className={cn('hover:shadow-md transition-all duration-200', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground hover:text-primary">
                <Link href={`/careers/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-sm text-muted-foreground">{job.company_name}</p>
            </div>
          </div>
          <Badge className={cn('shrink-0', jobTypeColors[job.job_type])}>
            {job.job_type.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(job.created_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button asChild className="w-full">
          <Link href={`/careers/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
