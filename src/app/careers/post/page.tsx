'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const jobSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters'),
  company_name: z.string().min(2, 'Company name is required'),
  location: z.string().optional(),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
})

type JobFormData = z.infer<typeof jobSchema>

export default function PostJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_type: 'full-time',
    },
  })

  const onSubmit = async (data: JobFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // In production, save to Supabase
      console.log('Job data:', data)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push('/careers')
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to jobs
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Post a Job</CardTitle>
              <CardDescription>
                Fill out the form below to post a job listing to our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}

                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Software Engineer"
                    {...register('title')}
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    placeholder="e.g. Oromo Tech Solutions"
                    {...register('company_name')}
                    disabled={isLoading}
                  />
                  {errors.company_name && (
                    <p className="text-sm text-red-600">{errors.company_name.message}</p>
                  )}
                </div>

                {/* Location & Job Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Minneapolis, MN or Remote"
                      {...register('location')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Type *</Label>
                    <Select
                      defaultValue="full-time"
                      onValueChange={(value) => setValue('job_type', value as JobFormData['job_type'])}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary_min">Minimum Salary (USD)</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      placeholder="e.g. 50000"
                      {...register('salary_min')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary_max">Maximum Salary (USD)</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      placeholder="e.g. 80000"
                      {...register('salary_max')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={6}
                    {...register('description')}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List the requirements (one per line, starting with -)&#10;- 3+ years of experience&#10;- Bachelor's degree"
                    rows={4}
                    {...register('requirements')}
                    disabled={isLoading}
                  />
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    placeholder="List the benefits (one per line, starting with -)&#10;- Health insurance&#10;- 401(k) matching"
                    rows={4}
                    {...register('benefits')}
                    disabled={isLoading}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Job'
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/careers">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
