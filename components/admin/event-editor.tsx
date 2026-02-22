'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types'

interface EventEditorProps {
  event: Event | null
}

export function EventEditor({ event: initialEvent }: EventEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const isNew = !initialEvent

  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(initialEvent?.title ?? '')
  const [description, setDescription] = useState(initialEvent?.description ?? '')
  const [type, setType] = useState(initialEvent?.type ?? 'webinar')
  const [scheduledAt, setScheduledAt] = useState(
    initialEvent?.scheduled_at
      ? new Date(initialEvent.scheduled_at).toISOString().slice(0, 16)
      : ''
  )
  const [durationMinutes, setDurationMinutes] = useState(initialEvent?.duration_minutes ?? 60)
  const [minTierLevel, setMinTierLevel] = useState(initialEvent?.min_tier_level ?? 1)
  const [maxParticipants, setMaxParticipants] = useState<string>(
    initialEvent?.max_participants ? String(initialEvent.max_participants) : ''
  )
  const [published, setPublished] = useState(initialEvent?.published ?? true)

  async function handleSave() {
    setSaving(true)
    try {
      const data = {
        title,
        description: description || null,
        type,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: Number(durationMinutes),
        min_tier_level: Number(minTierLevel),
        max_participants: maxParticipants ? Number(maxParticipants) : null,
        published,
      }

      if (isNew) {
        const { data: created, error } = await supabase
          .from('events')
          .insert(data)
          .select('id')
          .single()
        if (error) throw error
        router.push(`/admin/events/${created.id}`)
      } else {
        const { error } = await supabase
          .from('events')
          .update(data)
          .eq('id', initialEvent.id)
        if (error) throw error
      }

      alert('Event saved!')
    } catch (err) {
      console.error(err)
      alert('Failed to save event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">{isNew ? 'New Event' : 'Edit Event'}</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Event'}
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Monthly Community Webinar" />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            <select
              value={type}
              onChange={e => setType(e.target.value as 'webinar' | 'group_call' | 'one_on_one' | 'recurring')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="webinar">Webinar</option>
              <option value="group_call">Group Call</option>
              <option value="one_on_one">1:1 Session</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Minimum Tier</Label>
            <select
              value={minTierLevel}
              onChange={e => setMinTierLevel(Number(e.target.value) as 1 | 2 | 3)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value={1}>Tier 1 — Community</option>
              <option value={2}>Tier 2 — Growth</option>
              <option value={3}>Tier 3 — VIP</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              min={15}
              step={15}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Max Participants (leave blank for unlimited)</Label>
          <Input
            type="number"
            value={maxParticipants}
            onChange={e => setMaxParticipants(e.target.value)}
            placeholder="e.g. 20"
            min="1"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Published (visible to members)</Label>
        </div>
      </div>
    </div>
  )
}
