'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Skill } from '@/types/odda'

interface SkillsManagerProps {
  skills: Skill[]
  onAdd: (name: string) => Promise<void>
  onRemove: (skillId: string) => Promise<void>
  editable?: boolean
}

export function SkillsManager({
  skills,
  onAdd,
  onRemove,
  editable = true
}: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleAdd = async () => {
    const skillName = newSkill.trim()
    if (!skillName) return

    // Check for duplicates
    if (skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      toast.error('This skill already exists')
      return
    }

    setIsAdding(true)
    try {
      await onAdd(skillName)
      setNewSkill('')
      toast.success('Skill added')
    } catch {
      toast.error('Failed to add skill')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (skillId: string) => {
    setRemovingId(skillId)
    try {
      await onRemove(skillId)
      toast.success('Skill removed')
    } catch {
      toast.error('Failed to remove skill')
    } finally {
      setRemovingId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-4">
      {/* Add new skill */}
      {editable && (
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill..."
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={isAdding || !newSkill.trim()}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Skills list */}
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills added yet</p>
        ) : (
          skills.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="pr-1.5 gap-1"
            >
              {skill.name}
              {skill.endorsement_count > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({skill.endorsement_count})
                </span>
              )}
              {editable && (
                <button
                  onClick={() => handleRemove(skill.id)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                  disabled={removingId === skill.id}
                >
                  {removingId === skill.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </button>
              )}
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}
