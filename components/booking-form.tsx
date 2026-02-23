'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BookingFormProps {
  userId: string
}

// Available time slots - in a production app these would come from
// an availability table managed by Shira in the admin panel.
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

function getNextWeekdays(count = 14): Date[] {
  const dates: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1) // start tomorrow
  while (dates.length < count) {
    const day = d.getDay()
    if (day !== 0 && day !== 6) dates.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export function BookingForm({ userId }: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const weekdays = getNextWeekdays(14)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: buildDateTime(selectedDate, selectedTime).toISOString(),
          notes: notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Booking failed')
      router.push('/bookings?booked=1')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function buildDateTime(date: Date, time: string): Date {
    const [hourMin, period] = time.split(' ')
    let [hours, minutes] = hourMin.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    const dt = new Date(date)
    dt.setHours(hours, minutes, 0, 0)
    return dt
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date picker */}
      <div className="space-y-3">
        <Label>Select a Date</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {weekdays.map((date, i) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString()
            return (
              <button
                key={i}
                type="button"
                onClick={() => { setSelectedDate(date); setSelectedTime(null) }}
                className={`rounded-lg border p-2 text-center transition-colors text-sm ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-border'
                }`}
              >
                <p className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className="text-xs opacity-80">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-3">
          <Label>Select a Time (Eastern Time)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`rounded-lg border p-2.5 text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-border'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">What would you like to focus on? (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. My 4-year-old's separation anxiety, navigating a new sibling, bedtime battles..."
          rows={3}
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
      )}

      {selectedDate && selectedTime && (
        <div className="rounded-xl bg-secondary/50 p-4 text-sm">
          <p className="font-medium mb-1">Booking summary</p>
          <p className="text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {' at '}{selectedTime} ET · 50 minutes
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Shira will confirm your session within 24 hours and send a video room link.
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={submitting || !selectedDate || !selectedTime}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Request Session'}
      </Button>
    </form>
  )
}
