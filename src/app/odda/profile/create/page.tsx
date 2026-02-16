'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check, User, Briefcase, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { ExperienceForm, EducationForm, SkillsManager } from '@/components/odda'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { ProfileFormData, ExperienceFormData, EducationFormData, Experience, Education, Skill } from '@/types/odda'

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Experience & Education', icon: Briefcase },
  { id: 3, title: 'Skills', icon: Lightbulb },
]

export default function CreateProfilePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  // Form data
  const [basicInfo, setBasicInfo] = useState<ProfileFormData>({
    headline: '',
    bio: '',
    location: '',
    website_url: '',
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
    is_open_to_work: false,
    is_open_to_hire: false,
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [showEducationForm, setShowEducationForm] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in to create a profile')
        router.push('/login?redirect=/odda/profile/create')
        return
      }

      // Check if user already has a profile
      const { data: existingProfile } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingProfile) {
        toast.info('You already have a profile')
        router.push('/odda/profile/edit')
      }
    }

    checkAuth()
  }, [router])

  const handleSaveBasicInfo = async () => {
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('professional_profiles')
        .insert({
          user_id: user.id,
          headline: basicInfo.headline || null,
          bio: basicInfo.bio || null,
          location: basicInfo.location || null,
          website_url: basicInfo.website_url || null,
          linkedin_url: basicInfo.linkedin_url || null,
          twitter_url: basicInfo.twitter_url || null,
          github_url: basicInfo.github_url || null,
          is_open_to_work: basicInfo.is_open_to_work,
          is_open_to_hire: basicInfo.is_open_to_hire,
        } as never)
        .select()
        .single() as { data: { id: string } | null; error: Error | null }

      if (error || !data) throw error || new Error('Failed to create profile')

      setProfileId(data.id)
      setCurrentStep(2)
      toast.success('Basic info saved!')
    } catch (error) {
      console.error('Failed to save basic info:', error)
      toast.error('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddExperience = async (formData: ExperienceFormData) => {
    if (!profileId) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: exp, error } = await supabase
        .from('experiences')
        .insert({
          profile_id: profileId,
          company_name: formData.company_name,
          title: formData.title,
          location: formData.location || null,
          start_date: formData.start_date,
          end_date: formData.is_current ? null : formData.end_date || null,
          is_current: formData.is_current,
          description: formData.description || null,
          order_index: experiences.length,
        } as never)
        .select()
        .single() as { data: Experience | null; error: Error | null }

      if (error || !exp) throw error || new Error('Failed to add experience')

      setExperiences([...experiences, exp])
      setShowExperienceForm(false)
      toast.success('Experience added!')
    } catch (error) {
      console.error('Failed to add experience:', error)
      toast.error('Failed to add experience')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddEducation = async (formData: EducationFormData) => {
    if (!profileId) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: edu, error } = await supabase
        .from('education')
        .insert({
          profile_id: profileId,
          institution_name: formData.institution_name,
          degree: formData.degree || null,
          field_of_study: formData.field_of_study || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          description: formData.description || null,
          order_index: education.length,
        } as never)
        .select()
        .single() as { data: Education | null; error: Error | null }

      if (error || !edu) throw error || new Error('Failed to add education')

      setEducation([...education, edu])
      setShowEducationForm(false)
      toast.success('Education added!')
    } catch (error) {
      console.error('Failed to add education:', error)
      toast.error('Failed to add education')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSkill = async (name: string) => {
    if (!profileId) return

    const supabase = createClient()
    const { data: skill, error } = await supabase
      .from('skills')
      .insert({
        profile_id: profileId,
        name: name.trim(),
      } as never)
      .select()
      .single() as { data: Skill | null; error: Error | null }

    if (error || !skill) throw error || new Error('Failed to add skill')

    setSkills([...skills, skill])
  }

  const handleRemoveSkill = async (skillId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId)

    if (error) throw error

    setSkills(skills.filter(s => s.id !== skillId))
  }

  const handleFinish = () => {
    toast.success('Profile created successfully!')
    router.push(`/odda/profile/${profileId?.split('-')[0]}`) // Navigate to profile
    router.refresh()
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/odda">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to ODDA
            </Link>
          </Button>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-3xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 ${
                      step.id === currentStep
                        ? 'text-primary font-medium'
                        : step.id < currentStep
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.id < currentStep
                          ? 'bg-primary text-primary-foreground'
                          : step.id === currentStep
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                )
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Tell us about yourself and what you do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={basicInfo.headline}
                    onChange={(e) => setBasicInfo({ ...basicInfo, headline: e.target.value })}
                    placeholder="e.g., Software Engineer at Google"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About</Label>
                  <Textarea
                    id="bio"
                    value={basicInfo.bio}
                    onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                    placeholder="Write a brief summary about yourself..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={basicInfo.location}
                    onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                    placeholder="e.g., Seattle, WA"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={basicInfo.linkedin_url}
                      onChange={(e) => setBasicInfo({ ...basicInfo, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={basicInfo.website_url}
                      onChange={(e) => setBasicInfo({ ...basicInfo, website_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_open_to_work"
                      checked={basicInfo.is_open_to_work}
                      onCheckedChange={(checked) =>
                        setBasicInfo({ ...basicInfo, is_open_to_work: checked as boolean })
                      }
                    />
                    <Label htmlFor="is_open_to_work" className="font-normal">
                      I&apos;m open to work opportunities
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_open_to_hire"
                      checked={basicInfo.is_open_to_hire}
                      onCheckedChange={(checked) =>
                        setBasicInfo({ ...basicInfo, is_open_to_hire: checked as boolean })
                      }
                    />
                    <Label htmlFor="is_open_to_hire" className="font-normal">
                      I&apos;m hiring / looking for talent
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSaveBasicInfo} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Continue'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Experience & Education */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                  <CardDescription>
                    Add your work experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {experiences.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {showExperienceForm ? (
                    <ExperienceForm
                      onSubmit={handleAddExperience}
                      onCancel={() => setShowExperienceForm(false)}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    <Button variant="outline" onClick={() => setShowExperienceForm(true)}>
                      + Add Experience
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {education.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {education.map((edu) => (
                        <div key={edu.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{edu.institution_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {edu.start_date} - {edu.end_date || 'Present'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {showEducationForm ? (
                    <EducationForm
                      onSubmit={handleAddEducation}
                      onCancel={() => setShowEducationForm(false)}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    <Button variant="outline" onClick={() => setShowEducationForm(true)}>
                      + Add Education
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add your professional skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsManager
                  skills={skills}
                  onAdd={handleAddSkill}
                  onRemove={handleRemoveSkill}
                />

                <div className="flex justify-between pt-6 mt-6 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleFinish}>
                    <Check className="w-4 h-4 mr-2" />
                    Finish
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
