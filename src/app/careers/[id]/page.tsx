import Link from 'next/link'
import { ArrowLeft, MapPin, DollarSign, Building2, Briefcase, Calendar, Share2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Job } from '@/types/careers'

// Mock job data
const mockJob: Job = {
  id: '1',
  title: 'Software Engineer',
  company_name: 'Oromo Tech Solutions',
  location: 'Minneapolis, MN',
  job_type: 'full-time',
  salary_min: 80000,
  salary_max: 120000,
  description: `We are looking for a talented software engineer to join our growing team at Oromo Tech Solutions. You will work on building scalable web applications using modern technologies to serve the Oromo community worldwide.

As a member of our engineering team, you will have the opportunity to work on impactful projects that connect and empower Oromo people around the globe.`,
  requirements: `- 3+ years of experience in software development
- Proficiency in JavaScript/TypeScript and React
- Experience with Node.js and REST APIs
- Familiarity with databases (PostgreSQL, MongoDB)
- Strong problem-solving skills
- Excellent communication skills
- Bachelor's degree in Computer Science or related field (or equivalent experience)`,
  benefits: `- Competitive salary ($80,000 - $120,000)
- Health, dental, and vision insurance
- 401(k) with company match
- Flexible work arrangements
- Professional development opportunities
- Paid parental leave
- Generous PTO policy`,
  status: 'active',
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
}

const jobTypeColors = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-blue-100 text-blue-700',
  'contract': 'bg-purple-100 text-purple-700',
  'internship': 'bg-orange-100 text-orange-700',
}

const formatSalary = (min: number | null, max: number | null): string => {
  if (!min && !max) return 'Competitive'
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}/year`
  if (min) return `From $${min.toLocaleString()}/year`
  if (max) return `Up to $${max.toLocaleString()}/year`
  return 'Competitive'
}

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  // In production, fetch job by id from Supabase
  void id
  const job = mockJob

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                          <p className="text-lg text-slate-600">{job.company_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <Badge className={jobTypeColors[job.job_type]}>
                          {job.job_type.replace('-', ' ')}
                        </Badge>
                        {job.location && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <DollarSign className="w-4 h-4" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    {job.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                          {req.replace(/^-\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.benefits.split('\n').filter(b => b.trim()).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                          {benefit.replace(/^-\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <Button className="w-full mb-4" size="lg">
                    Apply Now
                  </Button>
                  <p className="text-sm text-slate-600 text-center mb-6">
                    Apply directly through our platform
                  </p>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Job Type</p>
                        <p className="font-medium text-slate-900 capitalize">
                          {job.job_type.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Location</p>
                        <p className="font-medium text-slate-900">{job.location || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Salary</p>
                        <p className="font-medium text-slate-900">
                          {formatSalary(job.salary_min, job.salary_max)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Posted</p>
                        <p className="font-medium text-slate-900">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
