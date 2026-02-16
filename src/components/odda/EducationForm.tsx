'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { EducationFormData, Education } from '@/types/odda'

interface EducationFormProps {
  education?: Education
  onSubmit: (data: EducationFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function EducationForm({
  education,
  onSubmit,
  onCancel,
  isSubmitting = false
}: EducationFormProps) {
  const [formData, setFormData] = useState<EducationFormData>({
    institution_name: education?.institution_name || '',
    degree: education?.degree || '',
    field_of_study: education?.field_of_study || '',
    start_date: education?.start_date || '',
    end_date: education?.end_date || '',
    description: education?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="institution_name">School / University *</Label>
        <Input
          id="institution_name"
          value={formData.institution_name}
          onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
          placeholder="Institution name"
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="e.g., Bachelor's, Master's, PhD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="field_of_study">Field of Study</Label>
          <Input
            id="field_of_study"
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
            placeholder="e.g., Computer Science, Business"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Year</Label>
          <Input
            id="start_date"
            type="number"
            min="1950"
            max="2030"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            placeholder="e.g., 2018"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Year (or expected)</Label>
          <Input
            id="end_date"
            type="number"
            min="1950"
            max="2030"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            placeholder="e.g., 2022"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Activities and Societies</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Clubs, organizations, achievements..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : education ? 'Save Changes' : 'Add Education'}
        </Button>
      </div>
    </form>
  )
}
