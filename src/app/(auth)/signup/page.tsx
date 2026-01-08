'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CalendarIcon, Info } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  signupSchema,
  type SignupFormData,
  calculateAge,
  getAgeGroup,
  gradeOptions,
  type AgeGroup
} from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null)
  const [age, setAge] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const birthday = watch('birthday')

  // Update age group when birthday changes
  useEffect(() => {
    if (birthday) {
      const calculatedAge = calculateAge(birthday)
      setAge(calculatedAge)
      setAgeGroup(getAgeGroup(calculatedAge))
    } else {
      setAge(null)
      setAgeGroup(null)
    }
  }, [birthday])

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const calculatedAge = calculateAge(data.birthday)
      const calculatedAgeGroup = getAgeGroup(calculatedAge)

      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            birthday: data.birthday.toISOString(),
            age_group: calculatedAgeGroup,
            grade_level: data.gradeLevel || null,
            parent_email: data.parentEmail || null,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-slate-900 mb-2 inline-block">
            Oromo
          </Link>
          <CardTitle className="text-xl text-green-600">Check your email</CardTitle>
          <CardDescription>
            {ageGroup === 'kids' ? (
              <>
                We&apos;ve sent a confirmation link to your parent&apos;s email.
                <br />
                Ask your parent to check their email to verify your account.
              </>
            ) : (
              <>
                We&apos;ve sent you a confirmation link. Please check your email to verify your account.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/login">Back to login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Link href="/" className="text-2xl font-bold text-slate-900 mb-2 inline-block">
          Oromo
        </Link>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>
          Join the Oromo community today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Your name"
              {...register('displayName')}
              disabled={isLoading}
            />
            {errors.displayName && (
              <p className="text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Birthday Picker */}
          <div className="space-y-2">
            <Label>Birthday</Label>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'MMMM d, yyyy') : 'Select your birthday'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.birthday && (
              <p className="text-sm text-red-600">{errors.birthday.message}</p>
            )}
          </div>

          {/* Age Group Badge */}
          {ageGroup && (
            <div className={cn(
              'p-3 rounded-md flex items-start gap-2',
              ageGroup === 'kids' && 'bg-purple-50 text-purple-700',
              ageGroup === 'teens' && 'bg-blue-50 text-blue-700',
              ageGroup === 'adults' && 'bg-green-50 text-green-700'
            )}>
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                {ageGroup === 'kids' && (
                  <>
                    <span className="font-medium">Kids Account</span>
                    <p className="mt-1">
                      You&apos;ll have access to fun, safe learning content designed for younger learners.
                      A parent email is required to create your account.
                    </p>
                  </>
                )}
                {ageGroup === 'teens' && (
                  <>
                    <span className="font-medium">Teen Account</span>
                    <p className="mt-1">
                      You&apos;ll have access to Academy, College Prep, and teen community features.
                      Please select your grade level below.
                    </p>
                  </>
                )}
                {ageGroup === 'adults' && (
                  <>
                    <span className="font-medium">Adult Account</span>
                    <p className="mt-1">
                      You&apos;ll have full access to all platform features including Academy, Careers,
                      Wiki, and Business Directory.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Parent Email - Required for kids */}
          {ageGroup === 'kids' && (
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Parent/Guardian Email *</Label>
              <Input
                id="parentEmail"
                type="email"
                placeholder="parent@example.com"
                {...register('parentEmail')}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500">
                Your parent will receive a verification email and can manage your account.
              </p>
              {errors.parentEmail && (
                <p className="text-sm text-red-600">{errors.parentEmail.message}</p>
              )}
            </div>
          )}

          {/* Grade Level - Required for teens */}
          {ageGroup === 'teens' && (
            <div className="space-y-2">
              <Label>Grade Level *</Label>
              <Controller
                name="gradeLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-slate-500">
                This helps us show you relevant college prep and academic content.
              </p>
              {errors.gradeLevel && (
                <p className="text-sm text-red-600">{errors.gradeLevel.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* COPPA Notice for kids */}
          {ageGroup === 'kids' && (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-md text-sm">
              <p className="font-medium">Parent/Guardian Notice</p>
              <p className="mt-1 text-xs">
                In accordance with COPPA regulations, accounts for children under 13 require
                parental consent. The parent/guardian will receive an email to verify and
                manage this account.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
