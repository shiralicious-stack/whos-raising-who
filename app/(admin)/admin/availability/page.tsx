'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SlotWithBooking {
  id: string
  scheduled_at: string
  duration_minutes: number
  is_booked: boolean
  intro_bookings: { name: string; email: string; notes?: string }[]
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<SlotWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('30')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadSlots() {
    const res = await fetch('/api/intro/admin')
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoading(false)
  }

  useEffect(() => { loadSlots() }, [])

  async function addSlot(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time) { setError('Please pick a date and time.'); return }

    setAdding(true)
    setError(null)
    const scheduledAt = new Date(`${date}T${time}`).toISOString()

    const res = await fetch('/api/intro/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledAt, durationMinutes: Number(duration) }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setAdding(false); return }

    setDate(''); setTime('')
    await loadSlots()
    setAdding(false)
  }

  async function deleteSlot(id: string) {
    setDeletingId(id)
    await fetch('/api/intro/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadSlots()
    setDeletingId(null)
  }

  const upcoming = slots.filter(s => new Date(s.scheduled_at) > new Date())
  const past = slots.filter(s => new Date(s.scheduled_at) <= new Date())

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold">Intro Call Availability</h1>
        <p className="text-muted-foreground mt-1">
          Add time slots here — visitors on the public booking page will see only the open ones.
        </p>
      </div>

      {/* Add slot form */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Add an available slot</h2>
        <form onSubmit={addSlot} className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-44"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-36"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (min)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              min="15"
              step="15"
              className="w-24"
            />
          </div>
          <Button type="submit" disabled={adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" />Add Slot</>}
          </Button>
        </form>
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>

      {/* Upcoming slots */}
      <div>
        <h2 className="font-semibold mb-3">Upcoming Slots ({upcoming.length})</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No upcoming slots yet. Add some above.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map(slot => (
              <SlotRow
                key={slot.id}
                slot={slot}
                onDelete={() => deleteSlot(slot.id)}
                deleting={deletingId === slot.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past/booked slots */}
      {past.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-muted-foreground">Past Slots</h2>
          <div className="space-y-3 opacity-60">
            {past.map(slot => (
              <SlotRow key={slot.id} slot={slot} past />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SlotRow({
  slot,
  onDelete,
  deleting,
  past,
}: {
  slot: SlotWithBooking
  onDelete?: () => void
  deleting?: boolean
  past?: boolean
}) {
  const booking = slot.intro_bookings?.[0]
  const dt = new Date(slot.scheduled_at)

  return (
    <div className={cn(
      'flex items-start justify-between gap-4 rounded-xl border bg-card p-4',
      slot.is_booked && 'border-primary/30 bg-primary/5'
    )}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">
            {dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </p>
          <p className="text-xs text-muted-foreground">{slot.duration_minutes} minutes</p>
          {booking && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <User className="h-3 w-3 text-primary" />
              <span className="font-medium">{booking.name}</span>
              <span className="text-muted-foreground">— {booking.email}</span>
            </div>
          )}
          {booking?.notes && (
            <p className="text-xs text-muted-foreground mt-1 italic">&ldquo;{booking.notes}&rdquo;</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={slot.is_booked ? 'default' : 'secondary'}>
          {slot.is_booked ? 'Booked' : 'Open'}
        </Badge>
        {!past && !slot.is_booked && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
