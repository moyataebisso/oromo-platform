'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Gift, Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
  // Referral program fields
  enable_referral: z.boolean().optional(),
  referral_bonus_amount: z.string().optional(),
  referral_bonus_currency: z.enum(['USD', 'EUR', 'ETB']).optional(),
  referral_bonus_type: z.enum(['cash', 'odda_points', 'gift_card', 'other']).optional(),
  referral_bonus_description: z.string().optional(),
  referral_max_referrals: z.string().optional(),
  referral_probation_days: z.string().optional(),
})

type JobFormData = z.infer<typeof jobSchema>

export default function PostJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enableReferral, setEnableReferral] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_type: 'full-time',
      referral_bonus_currency: 'USD',
      referral_bonus_type: 'cash',
      referral_probation_days: '90',
    },
  })

  const handleReferralToggle = (checked: boolean) => {
    setEnableReferral(checked)
    setValue('enable_referral', checked)
  }

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
                    placeholder="e.g. Odda Academy Tech Solutions"
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

                {/* Referral Program Section */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex items-start gap-3 mb-6">
                    <Checkbox
                      id="enable_referral"
                      checked={enableReferral}
                      onCheckedChange={handleReferralToggle}
                      disabled={isLoading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="enable_referral"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Gift className="w-4 h-4 text-primary" />
                        Enable Referral Bonus
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Offer a bonus to community members who refer successful candidates
                      </p>
                    </div>
                  </div>

                  {enableReferral && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Info className="w-4 h-4" />
                        <span>Referrals can help you find quality candidates faster</span>
                      </div>

                      {/* Bonus Amount & Currency */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="referral_bonus_amount">Bonus Amount *</Label>
                          <Input
                            id="referral_bonus_amount"
                            type="number"
                            placeholder="e.g. 1000"
                            {...register('referral_bonus_amount')}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select
                            defaultValue="USD"
                            onValueChange={(value) => setValue('referral_bonus_currency', value as 'USD' | 'EUR' | 'ETB')}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="ETB">ETB (Ethiopian Birr)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Bonus Type */}
                      <div className="space-y-2">
                        <Label>Bonus Type</Label>
                        <Select
                          defaultValue="cash"
                          onValueChange={(value) => setValue('referral_bonus_type', value as 'cash' | 'odda_points' | 'gift_card' | 'other')}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bonus type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="odda_points">Odda Academy Points</SelectItem>
                            <SelectItem value="gift_card">Gift Card</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bonus Description */}
                      <div className="space-y-2">
                        <Label htmlFor="referral_bonus_description">Additional Bonus Details (Optional)</Label>
                        <Textarea
                          id="referral_bonus_description"
                          placeholder="e.g. Plus company swag, or additional Odda Academy points"
                          rows={2}
                          {...register('referral_bonus_description')}
                          disabled={isLoading}
                        />
                      </div>

                      {/* Max Referrals & Probation Period */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="referral_max_referrals">
                            Max Referrals
                            <span className="text-muted-foreground font-normal ml-1">(blank = unlimited)</span>
                          </Label>
                          <Input
                            id="referral_max_referrals"
                            type="number"
                            placeholder="Leave blank for unlimited"
                            {...register('referral_max_referrals')}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="referral_probation_days">Probation Period (days)</Label>
                          <Input
                            id="referral_probation_days"
                            type="number"
                            placeholder="90"
                            defaultValue="90"
                            {...register('referral_probation_days')}
                            disabled={isLoading}
                          />
                          <p className="text-xs text-muted-foreground">
                            Bonus is paid after the hire completes this period
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
