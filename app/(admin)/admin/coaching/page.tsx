'use client'

import { useEffect, useState } from 'react'
import { Trash2, Loader2, Clock, User, Plus, Zap } from 'lucide-react'
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
  coaching_bookings: { name: string; email: string; notes?: string }[]
}

const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

const TIME_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
]

function fmt(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export default function CoachingAvailabilityPage() {
  const [slots, setSlots] = useState<SlotWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [tab, setTab] = useState<'batch' | 'single'>('batch')

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]))
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set(['10:00', '14:00']))
  const [batchDuration, setBatchDuration] = useState('50')
  const [batchAdding, setBatchAdding] = useState(false)
  const [batchMsg, setBatchMsg] = useState<string | null>(null)
  const [batchError, setBatchError] = useState<string | null>(null)

  const [singleDate, setSingleDate] = useState('')
  const [singleTimes, setSingleTimes] = useState<Set<string>>(new Set())
  const [singleDuration, setSingleDuration] = useState('50')
  const [singleAdding, setSingleAdding] = useState(false)
  const [singleMsg, setSingleMsg] = useState<string | null>(null)
  const [singleError, setSingleError] = useState<string | null>(null)

  async function loadSlots() {
    const res = await fetch('/api/coaching/admin')
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoading(false)
  }

  useEffect(() => { loadSlots() }, [])

  function buildBatchSlots() {
    if (!fromDate || !toDate || selectedDays.size === 0 || selectedTimes.size === 0) return []
    const result: { scheduledAt: string; durationMinutes: number }[] = []
    const cur = new Date(fromDate + 'T00:00:00')
    const end = new Date(toDate + 'T23:59:59')
    while (cur <= end) {
      if (selectedDays.has(cur.getDay())) {
        for (const time of Array.from(selectedTimes).sort()) {
          const [h, m] = time.split(':').map(Number)
          const dt = new Date(cur)
          dt.setHours(h, m, 0, 0)
          result.push({ scheduledAt: dt.toISOString(), durationMinutes: Number(batchDuration) })
        }
      }
      cur.setDate(cur.getDate() + 1)
    }
    return result
  }

  async function addBatch() {
    const newSlots = buildBatchSlots()
    if (newSlots.length === 0) { setBatchError('Select a date range, days, and times first.'); return }
    setBatchAdding(true); setBatchError(null); setBatchMsg(null)
    const res = await fetch('/api/coaching/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots: newSlots }),
    })
    const data = await res.json()
    if (!res.ok) { setBatchError(data.error); setBatchAdding(false); return }
    setBatchMsg(`✓ Added ${data.count} slots`)
    await loadSlots()
    setBatchAdding(false)
  }

  async function addSingle() {
    if (!singleDate || singleTimes.size === 0) { setSingleError('Select a date and at least one time.'); return }
    setSingleAdding(true); setSingleError(null); setSingleMsg(null)
    const newSlots = Array.from(singleTimes).sort().map(time => {
      const [h, m] = time.split(':').map(Number)
      const dt = new Date(singleDate + 'T00:00:00')
      dt.setHours(h, m, 0, 0)
      return { scheduledAt: dt.toISOString(), durationMinutes: Number(singleDuration) }
    })
    const res = await fetch('/api/coaching/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots: newSlots }),
    })
    const data = await res.json()
    if (!res.ok) { setSingleError(data.error); setSingleAdding(false); return }
    setSingleMsg(`✓ Added ${data.count} slot${data.count !== 1 ? 's' : ''}`)
    setSingleTimes(new Set())
    await loadSlots()
    setSingleAdding(false)
  }

  async function deleteSlot(id: string) {
    setDeletingId(id)
    await fetch('/api/coaching/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadSlots()
    setDeletingId(null)
  }

  function toggleDay(d: number) {
    setSelectedDays(prev => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n })
  }
  function toggleTime(t: string) {
    setSelectedTimes(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n })
  }
  function toggleSingleTime(t: string) {
    setSingleTimes(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n })
  }

  const upcoming = slots.filter(s => new Date(s.scheduled_at) > new Date())
  const past = slots.filter(s => new Date(s.scheduled_at) <= new Date())
  const batchPreview = buildBatchSlots().length
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold">Coaching Session Availability</h1>
        <p className="text-muted-foreground mt-1">
          Add open slots for 50-minute coaching sessions — visible to anyone on the Coaching page.
        </p>
      </div>

      <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
        <button
          onClick={() => setTab('batch')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'batch' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          <Zap className="h-4 w-4" /> Batch Schedule
        </button>
        <button
          onClick={() => setTab('single')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'single' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          <Plus className="h-4 w-4" /> Single Day
        </button>
      </div>

      {tab === 'batch' && (
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-1">Batch schedule</h2>
            <p className="text-sm text-muted-foreground">Pick a date range, days, and times — all slots generated at once.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} min={today} className="w-40" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} min={fromDate || today} className="w-40" />
            </div>
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input type="number" value={batchDuration} onChange={e => setBatchDuration(e.target.value)} min="15" step="5" className="w-24" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Days of the week</Label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map(d => (
                <button key={d.value} onClick={() => toggleDay(d.value)}
                  className={cn('w-12 h-10 rounded-lg text-sm font-medium border transition-colors',
                    selectedDays.has(d.value) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted text-muted-foreground')}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Times</Label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map(t => (
                <button key={t} onClick={() => toggleTime(t)}
                  className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                    selectedTimes.has(t) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted text-muted-foreground')}>
                  {fmt(t)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex-1">
              {batchPreview > 0 && <p className="text-sm text-muted-foreground">Will create <span className="font-semibold text-foreground">{batchPreview} slots</span></p>}
              {batchMsg && <p className="text-sm text-primary font-medium">{batchMsg}</p>}
              {batchError && <p className="text-sm text-destructive">{batchError}</p>}
            </div>
            <Button onClick={addBatch} disabled={batchAdding || batchPreview === 0}>
              {batchAdding ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Adding...</> : <><Zap className="h-4 w-4 mr-2" />Add {batchPreview > 0 ? batchPreview : ''} Slots</>}
            </Button>
          </div>
        </div>
      )}

      {tab === 'single' && (
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-1">Add slots for one day</h2>
            <p className="text-sm text-muted-foreground">Pick a date and select available times.</p>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={singleDate} onChange={e => setSingleDate(e.target.value)} min={today} className="w-44" />
          </div>
          {singleDate && (
            <div className="space-y-2">
              <Label>Available times</Label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map(t => (
                  <button key={t} onClick={() => toggleSingleTime(t)}
                    className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                      singleTimes.has(t) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted text-muted-foreground')}>
                    {fmt(t)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 items-end pt-2 border-t">
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input type="number" value={singleDuration} onChange={e => setSingleDuration(e.target.value)} min="15" step="5" className="w-24" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                {singleMsg && <p className="text-sm text-primary font-medium">{singleMsg}</p>}
                {singleError && <p className="text-sm text-destructive">{singleError}</p>}
              </div>
              <Button onClick={addSingle} disabled={singleAdding || singleTimes.size === 0}>
                {singleAdding ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Adding...</> : <><Plus className="h-4 w-4 mr-2" />Add {singleTimes.size > 0 ? singleTimes.size : ''} Slot{singleTimes.size !== 1 ? 's' : ''}</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-3">Upcoming Slots ({upcoming.length})</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 border rounded-xl text-center p-8">No upcoming slots — add some above.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(slot => (
              <SlotRow key={slot.id} slot={slot} onDelete={() => deleteSlot(slot.id)} deleting={deletingId === slot.id} />
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-muted-foreground">Past & Booked</h2>
          <div className="space-y-2 opacity-60">
            {past.map(slot => <SlotRow key={slot.id} slot={slot} past />)}
          </div>
        </div>
      )}
    </div>
  )
}

function SlotRow({ slot, onDelete, deleting, past }: {
  slot: SlotWithBooking; onDelete?: () => void; deleting?: boolean; past?: boolean
}) {
  const booking = slot.coaching_bookings?.[0]
  const dt = new Date(slot.scheduled_at)
  return (
    <div className={cn('flex items-start justify-between gap-4 rounded-xl border bg-card p-4', slot.is_booked && 'border-primary/30 bg-primary/5')}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">
            {dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            <span className="text-muted-foreground font-normal text-xs ml-2">{slot.duration_minutes} min</span>
          </p>
          {booking && (
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <User className="h-3 w-3 text-primary" />
              <span className="font-medium">{booking.name}</span>
              <span className="text-muted-foreground">· {booking.email}</span>
            </div>
          )}
          {booking?.notes && <p className="text-xs text-muted-foreground mt-0.5 italic">&ldquo;{booking.notes}&rdquo;</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={slot.is_booked ? 'default' : 'secondary'} className="text-xs">{slot.is_booked ? 'Booked' : 'Open'}</Badge>
        {!past && !slot.is_booked && onDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
