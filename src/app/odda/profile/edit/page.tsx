'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Save, Trash2, Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ExperienceForm, EducationForm, SkillsManager } from '@/components/odda'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { ProfessionalProfile, Experience, Education, Skill, ExperienceFormData, EducationFormData } from '@/types/odda'

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null)

  // Form state
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [isOpenToWork, setIsOpenToWork] = useState(false)
  const [isOpenToHire, setIsOpenToHire] = useState(false)

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddEducation, setShowAddEducation] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in')
        router.push('/login?redirect=/odda/profile/edit')
        return
      }

      type ProfileWithRelations = ProfessionalProfile & {
        experiences: Experience[]
        education: Education[]
        skills: Skill[]
      }

      const { data } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          experiences(*),
          education(*),
          skills(*)
        `)
        .eq('user_id', user.id)
        .single() as { data: ProfileWithRelations | null }

      if (!data) {
        toast.info('Create a profile first')
        router.push('/odda/profile/create')
        return
      }

      setProfile(data)
      setHeadline(data.headline || '')
      setBio(data.bio || '')
      setLocation(data.location || '')
      setWebsiteUrl(data.website_url || '')
      setLinkedinUrl(data.linkedin_url || '')
      setTwitterUrl(data.twitter_url || '')
      setGithubUrl(data.github_url || '')
      setIsOpenToWork(data.is_open_to_work || false)
      setIsOpenToHire(data.is_open_to_hire || false)
      setExperiences(data.experiences?.sort((a: Experience, b: Experience) => a.order_index - b.order_index) || [])
      setEducation(data.education?.sort((a: Education, b: Education) => a.order_index - b.order_index) || [])
      setSkills(data.skills || [])
      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSaveBasicInfo = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('professional_profiles')
        .update({
          headline: headline || null,
          bio: bio || null,
          location: location || null,
          website_url: websiteUrl || null,
          linkedin_url: linkedinUrl || null,
          twitter_url: twitterUrl || null,
          github_url: githubUrl || null,
          is_open_to_work: isOpenToWork,
          is_open_to_hire: isOpenToHire,
          updated_at: new Date().toISOString(),
        } as never)
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Profile updated!')
    } catch (error) {
      console.error('Failed to save:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExperience = async (data: ExperienceFormData) => {
    if (!profile) return

    const supabase = createClient()
    const { data: exp, error } = await supabase
      .from('experiences')
      .insert({
        profile_id: profile.id,
        company_name: data.company_name,
        title: data.title,
        location: data.location || null,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date || null,
        is_current: data.is_current,
        description: data.description || null,
        order_index: experiences.length,
      } as never)
      .select()
      .single() as { data: Experience | null; error: Error | null }

    if (error || !exp) {
      toast.error('Failed to add experience')
      return
    }

    setExperiences([...experiences, exp])
    setShowAddExperience(false)
    toast.success('Experience added!')
  }

  const handleUpdateExperience = async (data: ExperienceFormData) => {
    if (!editingExperience) return

    const supabase = createClient()
    const { error } = await supabase
      .from('experiences')
      .update({
        company_name: data.company_name,
        title: data.title,
        location: data.location || null,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date || null,
        is_current: data.is_current,
        description: data.description || null,
      } as never)
      .eq('id', editingExperience.id)

    if (error) {
      toast.error('Failed to update experience')
      return
    }

    setExperiences(experiences.map(exp =>
      exp.id === editingExperience.id
        ? { ...exp, ...data, end_date: data.is_current ? null : data.end_date }
        : exp
    ))
    setEditingExperience(null)
    toast.success('Experience updated!')
  }

  const handleDeleteExperience = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('experiences').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete experience')
      return
    }

    setExperiences(experiences.filter(exp => exp.id !== id))
    toast.success('Experience deleted')
  }

  const handleAddEducation = async (data: EducationFormData) => {
    if (!profile) return

    const supabase = createClient()
    const { data: edu, error } = await supabase
      .from('education')
      .insert({
        profile_id: profile.id,
        institution_name: data.institution_name,
        degree: data.degree || null,
        field_of_study: data.field_of_study || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        description: data.description || null,
        order_index: education.length,
      } as never)
      .select()
      .single() as { data: Education | null; error: Error | null }

    if (error || !edu) {
      toast.error('Failed to add education')
      return
    }

    setEducation([...education, edu])
    setShowAddEducation(false)
    toast.success('Education added!')
  }

  const handleUpdateEducation = async (data: EducationFormData) => {
    if (!editingEducation) return

    const supabase = createClient()
    const { error } = await supabase
      .from('education')
      .update({
        institution_name: data.institution_name,
        degree: data.degree || null,
        field_of_study: data.field_of_study || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        description: data.description || null,
      } as never)
      .eq('id', editingEducation.id)

    if (error) {
      toast.error('Failed to update education')
      return
    }

    setEducation(education.map(edu =>
      edu.id === editingEducation.id
        ? { ...edu, ...data }
        : edu
    ))
    setEditingEducation(null)
    toast.success('Education updated!')
  }

  const handleDeleteEducation = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('education').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete education')
      return
    }

    setEducation(education.filter(edu => edu.id !== id))
    toast.success('Education deleted')
  }

  const handleAddSkill = async (name: string) => {
    if (!profile) return

    const supabase = createClient()
    const { data: skill, error } = await supabase
      .from('skills')
      .insert({ profile_id: profile.id, name: name.trim() } as never)
      .select()
      .single() as { data: Skill | null; error: Error | null }

    if (error || !skill) throw error || new Error('Failed to add skill')

    setSkills([...skills, skill])
  }

  const handleRemoveSkill = async (skillId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('skills').delete().eq('id', skillId)

    if (error) throw error

    setSkills(skills.filter(s => s.id !== skillId))
  }

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/odda/profile/${profile?.user_id}`}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Profile
            </Link>
          </Button>
          <Button onClick={handleSaveBasicInfo} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Software Engineer at Google"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Seattle, WA"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openToWork"
                    checked={isOpenToWork}
                    onCheckedChange={(checked) => setIsOpenToWork(checked as boolean)}
                  />
                  <Label htmlFor="openToWork" className="font-normal">
                    I&apos;m open to work opportunities
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openToHire"
                    checked={isOpenToHire}
                    onCheckedChange={(checked) => setIsOpenToHire(checked as boolean)}
                  />
                  <Label htmlFor="openToHire" className="font-normal">
                    I&apos;m hiring / looking for talent
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Your work history</CardDescription>
              </div>
              {!showAddExperience && !editingExperience && (
                <Button variant="outline" size="sm" onClick={() => setShowAddExperience(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {showAddExperience && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <ExperienceForm
                    onSubmit={handleAddExperience}
                    onCancel={() => setShowAddExperience(false)}
                  />
                </div>
              )}

              {editingExperience && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <ExperienceForm
                    experience={editingExperience}
                    onSubmit={handleUpdateExperience}
                    onCancel={() => setEditingExperience(null)}
                  />
                </div>
              )}

              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={exp.id}>
                    {i > 0 && <Separator className="mb-4" />}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingExperience(exp)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this experience? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteExperience(exp.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && !showAddExperience && (
                  <p className="text-sm text-muted-foreground">No experience added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </div>
              {!showAddEducation && !editingEducation && (
                <Button variant="outline" size="sm" onClick={() => setShowAddEducation(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {showAddEducation && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <EducationForm
                    onSubmit={handleAddEducation}
                    onCancel={() => setShowAddEducation(false)}
                  />
                </div>
              )}

              {editingEducation && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <EducationForm
                    education={editingEducation}
                    onSubmit={handleUpdateEducation}
                    onCancel={() => setEditingEducation(null)}
                  />
                </div>
              )}

              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={edu.id}>
                    {i > 0 && <Separator className="mb-4" />}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{edu.institution_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {edu.start_date} - {edu.end_date || 'Present'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingEducation(edu)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Education</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this education entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEducation(edu.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
                {education.length === 0 && !showAddEducation && (
                  <p className="text-sm text-muted-foreground">No education added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsManager
                skills={skills}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
