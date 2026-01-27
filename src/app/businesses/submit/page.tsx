'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Loader2,
  CheckCircle,
  Building2,
  Phone,
  MapPin,
  Image,
  Clock,
  FileCheck,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BUSINESS_CATEGORIES } from '@/types/business'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'Washington DC' }, { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const businessSchema = z.object({
  // Step 1: Basic Info
  name: z.string().min(2, 'Business name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  isOwner: z.boolean(),

  // Step 2: Contact Info
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),

  // Step 3: Location
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().optional(),

  // Step 4: Media (handled separately)

  // Step 5: Hours
  hours: z.object({
    monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
    friday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
    sunday: z.object({ open: z.string(), close: z.string(), closed: z.boolean() }).optional(),
  }).optional(),

  // Step 6: Review
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
})

type BusinessFormData = z.infer<typeof businessSchema>

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Building2 },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Media', icon: Image },
  { id: 5, title: 'Hours', icon: Clock },
  { id: 6, title: 'Review', icon: FileCheck },
]

const DRAFT_KEY = 'business-submit-draft'

export default function SubmitBusinessPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      isOwner: false,
      phone: '',
      email: '',
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      hours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '14:00', closed: false },
        sunday: { open: '', close: '', closed: true },
      },
      termsAccepted: false,
    },
  })

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        form.reset(parsed)
        toast.info('Draft restored', { description: 'Your previous progress has been loaded.' })
      } catch {
        // Invalid draft, ignore
      }
    }
  }, [form])

  // Save draft to localStorage
  const saveDraft = () => {
    const values = form.getValues()
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
    toast.success('Draft saved')
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Cover photo must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      if (galleryPreviews.length + files.length > 5) {
        toast.error('Maximum 5 gallery images allowed')
        return
      }
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`)
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = async () => {
    // Validate current step before proceeding
    let fieldsToValidate: (keyof BusinessFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'category']
        break
      case 3:
        fieldsToValidate = ['address', 'city', 'state']
        break
      case 6:
        fieldsToValidate = ['termsAccepted']
        break
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate)
      if (!isValid) return
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: BusinessFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Submit to Supabase
      console.log('Submitting:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearDraft()
      setSubmitted(true)
      toast.success('Business submitted successfully!')

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/businesses')
      }, 3000)
    } catch {
      toast.error('Failed to submit business')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 dark:bg-background flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Submission Received!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Your business has been submitted for review. We&apos;ll notify you once it&apos;s approved, usually within 1-2 business days.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/businesses">Browse Businesses</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/businesses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
          </Button>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          isActive && 'bg-emerald-600 text-white',
                          isCompleted && 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400',
                          !isActive && !isCompleted && 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={cn(
                        'text-xs mt-2 hidden sm:block',
                        isActive && 'text-emerald-600 dark:text-emerald-400 font-medium',
                        !isActive && 'text-slate-500'
                      )}>
                        {step.title}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          'w-12 sm:w-24 h-1 mx-2',
                          isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {STEPS.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Business Name *</Label>
                      <Input
                        id="name"
                        {...form.register('name')}
                        placeholder="e.g., Oromia Restaurant"
                        className="mt-2"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={form.watch('category')}
                        onValueChange={(value) => form.setValue('category', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.slice(0, 14).map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.category && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...form.register('description')}
                        placeholder="Tell us about your business..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isOwner"
                        checked={form.watch('isOwner')}
                        onCheckedChange={(checked) => form.setValue('isOwner', checked as boolean)}
                      />
                      <Label htmlFor="isOwner" className="cursor-pointer">
                        I am the owner or authorized representative of this business
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Info */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...form.register('phone')}
                          placeholder="(612) 555-0123"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register('email')}
                          placeholder="info@yourbusiness.com"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        {...form.register('website')}
                        placeholder="https://yourbusiness.com"
                        className="mt-2"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Social Media (optional)
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            {...form.register('facebook')}
                            placeholder="https://facebook.com/yourbusiness"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            {...form.register('instagram')}
                            placeholder="https://instagram.com/yourbusiness"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        {...form.register('address')}
                        placeholder="123 Main Street"
                        className="mt-2"
                      />
                      {form.formState.errors.address && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...form.register('city')}
                          placeholder="Minneapolis"
                          className="mt-2"
                        />
                        {form.formState.errors.city && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={form.watch('state')}
                          onValueChange={(value) => form.setValue('state', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.state && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.state.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zip_code">ZIP Code</Label>
                        <Input
                          id="zip_code"
                          {...form.register('zip_code')}
                          placeholder="55407"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Media */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label>Logo</Label>
                        <div className="mt-2">
                          {logoPreview ? (
                            <div className="relative w-32 h-32">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setLogoPreview(null)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer block">
                              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                              <p className="text-sm text-slate-500">Click to upload logo</p>
                              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                              <input
                                type="file"
                                accept="image/png,image/jpeg"
                                className="hidden"
                                onChange={handleLogoUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Cover Photo</Label>
                        <div className="mt-2">
                          {coverPreview ? (
                            <div className="relative h-32">
                              <img
                                src={coverPreview}
                                alt="Cover preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setCoverPreview(null)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer block">
                              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                              <p className="text-sm text-slate-500">Click to upload cover</p>
                              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                              <input
                                type="file"
                                accept="image/png,image/jpeg"
                                className="hidden"
                                onChange={handleCoverUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Gallery Images ({galleryPreviews.length}/5)</Label>
                      <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {galleryPreviews.length < 5 && (
                          <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-emerald-400 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 text-slate-400" />
                            <span className="text-xs text-slate-400 mt-1">Add</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              multiple
                              className="hidden"
                              onChange={handleGalleryUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Hours */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    {DAYS.map((day) => {
                      const dayHours = form.watch(`hours.${day}`)
                      return (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-28">
                            <span className="font-medium capitalize">{day}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`${day}-closed`}
                              checked={dayHours?.closed || false}
                              onCheckedChange={(checked) => {
                                form.setValue(`hours.${day}.closed`, checked as boolean)
                              }}
                            />
                            <Label htmlFor={`${day}-closed`} className="text-sm">Closed</Label>
                          </div>
                          {!dayHours?.closed && (
                            <>
                              <Input
                                type="time"
                                className="w-32"
                                value={dayHours?.open || '09:00'}
                                onChange={(e) => form.setValue(`hours.${day}.open`, e.target.value)}
                              />
                              <span className="text-slate-500">to</span>
                              <Input
                                type="time"
                                className="w-32"
                                value={dayHours?.close || '17:00'}
                                onChange={(e) => form.setValue(`hours.${day}.close`, e.target.value)}
                              />
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Review Your Submission</h3>
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Business Name:</dt>
                          <dd className="font-medium">{form.watch('name')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Category:</dt>
                          <dd className="font-medium">
                            {BUSINESS_CATEGORIES.find(c => c.value === form.watch('category'))?.label}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Location:</dt>
                          <dd className="font-medium">
                            {form.watch('city')}, {form.watch('state')}
                          </dd>
                        </div>
                        {form.watch('phone') && (
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Phone:</dt>
                            <dd className="font-medium">{form.watch('phone')}</dd>
                          </div>
                        )}
                        {form.watch('website') && (
                          <div className="flex justify-between">
                            <dt className="text-slate-500">Website:</dt>
                            <dd className="font-medium truncate max-w-[200px]">{form.watch('website')}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Your business will be reviewed by our team before being published.
                        This usually takes 1-2 business days.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={form.watch('termsAccepted')}
                        onCheckedChange={(checked) => form.setValue('termsAccepted', checked as boolean)}
                      />
                      <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                        I confirm that I am the owner or authorized representative of this business
                        and that all information provided is accurate. I agree to the{' '}
                        <Link href="/terms" className="text-emerald-600 hover:underline">
                          Terms of Service
                        </Link>
                        .
                      </Label>
                    </div>
                    {form.formState.errors.termsAccepted && (
                      <p className="text-sm text-red-500">{form.formState.errors.termsAccepted.message}</p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div>
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={saveDraft}>
                      Save Draft
                    </Button>
                    {currentStep < STEPS.length ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Business'
                        )}
                      </Button>
                    )}
                  </div>
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
