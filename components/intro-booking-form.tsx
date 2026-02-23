'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Clock, Video, Phone } from 'lucide-react'
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const grid: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)
  while (grid.length % 7 !== 0) grid.push(null)
  return grid
}

export function IntroBookingForm() {
  const today = new Date()
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<{ y: number; m: number; d: number } | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [meetingType, setMeetingType] = useState<'video' | 'phone'>('video')
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

  function getSlotsForDay(y: number, m: number, d: number) {
    return slots.filter(s => {
      const dt = new Date(s.scheduled_at)
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
    }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
  }

  function hasSlots(y: number, m: number, d: number) {
    return getSlotsForDay(y, m, d).length > 0
  }

  function isPast(y: number, m: number, d: number) {
    const dt = new Date(y, m, d)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return dt < todayMidnight
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelectedDay(null)
    setSelectedSlot(null)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelectedDay(null)
    setSelectedSlot(null)
  }

  function selectDay(d: number) {
    setSelectedDay({ y: viewYear, m: viewMonth, d })
    setSelectedSlot(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot || !name.trim() || !email.trim()) {
      setError('Please fill in your name and email.')
      return
    }
    if (meetingType === 'phone' && !phone.trim()) {
      setError('Please enter your phone number for a phone call.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/intro/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot.id, name, email, phone, meetingType, notes }),
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

  // ── Confirmation ──────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-2xl font-bold mb-2">You&apos;re booked!</h3>
        <p className="text-muted-foreground max-w-xs">
          A confirmation is on its way to <strong>{email}</strong>.{' '}
          {meetingType === 'phone'
            ? 'Shira will call you at the number you provided.'
            : 'Shira will send a video room link before your call.'}
        </p>
      </div>
    )
  }

  const grid = buildGrid(viewYear, viewMonth)
  const daySlots = selectedDay ? getSlotsForDay(selectedDay.y, selectedDay.m, selectedDay.d) : []

  // ── Main calendar layout ──────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x min-h-[420px]">

      {/* LEFT: Calendar */}
      <div className="flex-1 p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            disabled={viewYear === today.getFullYear() && viewMonth <= today.getMonth()}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="font-semibold text-sm">
            {MONTHS[viewMonth]} {viewYear}
          </p>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-y-1">
            {grid.map((day, i) => {
              if (!day) return <div key={i} />
              const available = hasSlots(viewYear, viewMonth, day)
              const past = isPast(viewYear, viewMonth, day)
              const isSelected = selectedDay?.y === viewYear && selectedDay?.m === viewMonth && selectedDay?.d === day
              const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()

              return (
                <button
                  key={i}
                  onClick={() => available && !past && selectDay(day)}
                  disabled={!available || past}
                  className={cn(
                    'relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                    isSelected && 'bg-primary text-primary-foreground font-semibold',
                    !isSelected && available && !past && 'font-semibold text-foreground hover:bg-primary/10 cursor-pointer',
                    !isSelected && isToday && !past && 'ring-2 ring-primary/40',
                    (!available || past) && 'text-muted-foreground/40 cursor-default',
                    available && !past && !isSelected && 'after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        )}

        {!loading && slots.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">No available times yet — check back soon.</p>
        )}

        <p className="text-xs text-muted-foreground mt-5 text-center">All times in Eastern Time</p>
      </div>

      {/* RIGHT: Time slots or Form */}
      <div className="flex-1 p-6">
        {!selectedDay && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Select a date</p>
            <p className="text-xs text-muted-foreground mt-1">Dates with available times are shown with a dot</p>
          </div>
        )}

        {selectedDay && !selectedSlot && (
          <div>
            <p className="font-semibold text-sm mb-1">
              {new Date(selectedDay.y, selectedDay.m, selectedDay.d).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>
            <p className="text-xs text-muted-foreground mb-5">{daySlots.length} time{daySlots.length !== 1 ? 's' : ''} available</p>
            <div className="space-y-2">
              {daySlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-colors group"
                >
                  <span>
                    {new Date(slot.scheduled_at).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit', hour12: true,
                    })}
                  </span>
                  <span className="text-xs opacity-70 group-hover:opacity-100">{slot.duration_minutes} min</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSlot && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected time summary */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 mb-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  {new Date(selectedSlot.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="font-semibold text-sm">
                  {new Date(selectedSlot.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  <span className="font-normal text-muted-foreground ml-1">ET · {selectedSlot.duration_minutes} min</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="text-xs text-primary hover:underline"
              >
                Change
              </button>
            </div>

            {/* Meeting type toggle */}
            <div className="space-y-1.5">
              <Label className="text-xs">How would you like to meet?</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingType('video')}
                  className={cn(
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors',
                    meetingType === 'video'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  <Video className="h-4 w-4" /> Video Call
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingType('phone')}
                  className={cn(
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors',
                    meetingType === 'phone'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  <Phone className="h-4 w-4" /> Phone Call
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Name <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">
                Phone Number {meetingType === 'phone' ? <span className="text-destructive">*</span> : <span className="text-muted-foreground">(optional)</span>}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
                required={meetingType === 'phone'}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs">What would you like to talk about? <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. My toddler's tantrums, a big transition, not sure where to start..." rows={2} className="text-sm resize-none" />
            </div>

            {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-2.5">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Free Call'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">No payment needed. You&apos;ll get a confirmation email right away.</p>
          </form>
        )}
      </div>
    </div>
  )
}
