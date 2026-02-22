'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Slot {
  id: string
  scheduled_at: string
  duration_minutes: number
}

interface GroupedSlots {
  [dateKey: string]: Slot[]
}

export function IntroBookingForm() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/intro/slots')
      .then(r => r.json())
      .then(d => setSlots(d.slots ?? []))
      .finally(() => setLoading(false))
  }, [])

  // Group slots by date
  const grouped: GroupedSlots = slots.reduce((acc, slot) => {
    const dateKey = new Date(slot.scheduled_at).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(slot)
    return acc
  }, {} as GroupedSlots)

  const dates = Object.keys(grouped)
  const timesForDate = selectedDate ? grouped[selectedDate] ?? [] : []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot || !name.trim() || !email.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/intro/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot.id, name, email, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Booking failed')
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-2xl font-bold mb-2">You&apos;re booked!</h3>
        <p className="text-muted-foreground">
          A confirmation has been sent to <strong>{email}</strong>.<br />
          Shira will be in touch with a meeting link before the call.
        </p>
      </div>
    )
  }

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No available times right now. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Pick a date */}
      {!selectedSlot && (
        <>
          <div>
            <h3 className="font-semibold mb-4">Pick a date</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dates.map(date => (
                <button
                  key={date}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                  className={cn(
                    'text-left rounded-xl border p-4 transition-colors',
                    selectedDate === date
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50 hover:bg-muted'
                  )}
                >
                  <p className="font-medium text-sm">{date}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {grouped[date].length} time{grouped[date].length !== 1 ? 's' : ''} available
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Pick a time */}
          {selectedDate && (
            <div>
              <h3 className="font-semibold mb-4">Pick a time</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timesForDate.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className="rounded-xl border p-3 text-sm font-medium hover:border-primary/50 hover:bg-muted transition-colors text-center"
                  >
                    {new Date(slot.scheduled_at).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit', hour12: true,
                    })}
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                      {slot.duration_minutes} min
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 3: Fill in details */}
      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <button
              type="button"
              onClick={() => setSelectedSlot(null)}
              className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-primary" />
            </button>
            <div>
              <p className="font-medium text-sm">
                {new Date(selectedSlot.scheduled_at).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(selectedSlot.scheduled_at).toLocaleTimeString('en-US', {
                  hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
                })} · {selectedSlot.duration_minutes} minutes
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First and last name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">What would you like to talk about? <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. My toddler's tantrums, navigating a big transition, not sure where to start..."
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : 'Confirm Free Call'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            No payment required. Shira will confirm and send a meeting link before your call.
          </p>
        </form>
      )}
    </div>
  )
}
