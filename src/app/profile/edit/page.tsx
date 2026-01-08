'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const profileSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

// Mock user data
const mockUser = {
  id: '1',
  email: 'bekele@example.com',
  display_name: 'Bekele Abera',
  username: 'bekele_a',
  bio: 'Passionate about preserving Oromo culture and language.',
  avatar_url: null,
  location: 'Minneapolis, MN',
}

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: mockUser.display_name,
      username: mockUser.username,
      bio: mockUser.bio,
      location: mockUser.location,
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // In production, update via Supabase
      console.log('Profile data:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/profile')
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={mockUser.avatar_url || undefined} />
                    <AvatarFallback className="text-xl">{mockUser.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <Separator />

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    {...register('display_name')}
                    disabled={isLoading}
                  />
                  {errors.display_name && (
                    <p className="text-sm text-red-600">{errors.display_name.message}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 rounded-l-md text-slate-600">
                      @
                    </span>
                    <Input
                      id="username"
                      className="rounded-l-none"
                      {...register('username')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    {...register('bio')}
                    disabled={isLoading}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    {...register('location')}
                    disabled={isLoading}
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={mockUser.email}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/profile">Cancel</Link>
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
