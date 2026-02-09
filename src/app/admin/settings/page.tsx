'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="text-slate-600">Manage your platform configuration</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Odda Academy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@odda.org" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              defaultValue="A comprehensive community platform for the Oromo diaspora worldwide."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Academy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Academy Settings</CardTitle>
          <CardDescription>Configure educational content settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxCourseSize">Max Course Size (MB)</Label>
              <Input id="maxCourseSize" type="number" defaultValue="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLessonsPerCourse">Max Lessons per Course</Label>
              <Input id="maxLessonsPerCourse" type="number" defaultValue="50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Careers Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Careers Settings</CardTitle>
          <CardDescription>Configure job listing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobExpiryDays">Job Listing Expiry (days)</Label>
              <Input id="jobExpiryDays" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxApplications">Max Applications per Job</Label>
              <Input id="maxApplications" type="number" defaultValue="100" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wiki Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Wiki Settings</CardTitle>
          <CardDescription>Configure wiki article settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minArticleLength">Min Article Length (words)</Label>
              <Input id="minArticleLength" type="number" defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moderationRequired">Require Moderation</Label>
              <select
                id="moderationRequired"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="yes"
              >
                <option value="yes">Yes - All new articles</option>
                <option value="new-users">Only for new users</option>
                <option value="no">No - Auto-publish</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
