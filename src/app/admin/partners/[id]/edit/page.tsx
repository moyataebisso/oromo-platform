'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  Building2,
  Loader2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'

interface Partner {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website: string | null
  is_featured: boolean | null
  show_on_homepage: boolean | null
  status: string | null
}

export default function EditPartnerPage() {
  const router = useRouter()
  const params = useParams()
  const partnerId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    website: '',
    description: '',
    is_featured: true,
    show_on_homepage: true,
  })

  // Fetch partner data
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', partnerId)
          .single()

        if (error) {
          console.error('Error fetching partner:', error)
          setError('Partner not found')
          return
        }

        const partner = data as Partner
        setFormData({
          name: partner.name,
          slug: partner.slug,
          website: partner.website || '',
          description: partner.description || '',
          is_featured: partner.is_featured ?? true,
          show_on_homepage: partner.show_on_homepage ?? true,
        })

        if (partner.logo_url) {
          setLogoPreview(partner.logo_url)
          setOriginalLogoUrl(partner.logo_url)
        }
      } catch (err) {
        console.error('Error fetching partner:', err)
        setError('An error occurred while loading the partner')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartner()
  }, [partnerId])

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB')
        return
      }

      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  // Upload logo to Supabase Storage
  const uploadLogo = async (slug: string): Promise<string | null> => {
    if (!logoFile) return originalLogoUrl

    setIsUploading(true)
    try {
      const supabase = createClient()
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${slug}-logo.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, logoFile, { upsert: true })

      if (uploadError) {
        console.error('Error uploading logo:', uploadError)
        return originalLogoUrl
      }

      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      console.error('Error uploading logo:', err)
      return originalLogoUrl
    } finally {
      setIsUploading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Partner name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()

      // Upload new logo if provided
      let logoUrl = logoPreview
      if (logoFile) {
        logoUrl = await uploadLogo(formData.slug)
      } else if (!logoPreview) {
        // Logo was removed
        logoUrl = null
      }

      // Update the partner
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          website: formData.website.trim() || null,
          logo_url: logoUrl,
          is_featured: formData.is_featured,
          show_on_homepage: formData.show_on_homepage,
          updated_at: new Date().toISOString(),
        } as never)
        .eq('id', partnerId)

      if (updateError) {
        setError(updateError.message)
        return
      }

      // Redirect to partners list
      router.push('/admin/partners')
    } catch (err) {
      console.error('Error updating partner:', err)
      setError('An error occurred while updating the partner')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && !formData.name) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/partners">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Partner Not Found</h1>
          </div>
        </div>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">The partner you are looking for does not exist.</p>
            <Button className="mt-4" onClick={() => router.push('/admin/partners')}>
              Back to Partners
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/partners">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Partner</h1>
          <p className="text-muted-foreground">Update partner information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Partner Information</CardTitle>
                <CardDescription>Basic information about the partner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Partner Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., OSFNA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.org"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the partner organization..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Partner Logo</CardTitle>
                <CardDescription>Upload a logo for the partner (PNG, JPG, max 2MB)</CardDescription>
              </CardHeader>
              <CardContent>
                {logoPreview ? (
                  <div className="relative w-32 h-32 rounded-lg border border-border overflow-hidden bg-white">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload logo</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visibility Settings */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>Control where this partner appears</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_featured" className="text-base">Featured Partner</Label>
                    <p className="text-sm text-muted-foreground">Mark as a featured partner</p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_on_homepage" className="text-base">Show on Homepage</Label>
                    <p className="text-sm text-muted-foreground">Display in the homepage gallery</p>
                  </div>
                  <Switch
                    id="show_on_homepage"
                    checked={formData.show_on_homepage}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_on_homepage: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How it will appear on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <p className="text-center mt-2 text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                    {formData.name || 'Partner Name'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isUploading ? 'Uploading Logo...' : 'Saving Changes...'}
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/admin/partners')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
