'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]

export default function AddBusinessPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    website: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.category || !formData.address || !formData.city || !formData.state) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitted(true)
    toast.success('Business submitted successfully!')
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Thank You!
              </h2>
              <p className="text-slate-600 mb-6">
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

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/businesses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add Your Business</CardTitle>
              <CardDescription>
                List your Oromo-owned business for free and connect with the community.
                All submissions are reviewed before publishing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Business Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g., Oromia Restaurant"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Category *
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Description
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Tell us about your business..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-slate-900">Location</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Street Address *
                      </label>
                      <Input
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        City *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Minneapolis"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          State *
                        </label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleChange('state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          ZIP Code
                        </label>
                        <Input
                          value={formData.zip_code}
                          onChange={(e) => handleChange('zip_code', e.target.value)}
                          placeholder="55407"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="(612) 555-0123"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="info@yourbusiness.com"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Website
                      </label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-slate-900">Images</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Logo
                      </label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">
                          Click to upload logo
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Cover Photo
                      </label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">
                          Click to upload cover
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t">
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-600">
                      By submitting, you confirm that you are the owner or authorized representative
                      of this business and that all information provided is accurate.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Business'
                    )}
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
