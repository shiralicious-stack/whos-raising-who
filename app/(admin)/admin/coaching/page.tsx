'use client'

import { useEffect, useState } from 'react'
import { Trash2, Loader2, Clock, User, Plus, RefreshCw, CheckSquare, Square } from 'lucide-react'
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

type Pattern = 'weekly' | 'biweekly' | 'monthly'
type Tab = 'recurring' | 'single'

function fmt(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

function buildRecurringSlots(
  fromDate: string,
  toDate: string,
  pattern: Pattern,
  selectedDays: Set<number>,
  selectedTimes: Set<string>,
  duration: number
) {
  if (!fromDate || !toDate || selectedDays.size === 0 || selectedTimes.size === 0) return []
  const result: { scheduledAt: string; durationMinutes: number }[] = []
  const times = Array.from(selectedTimes).sort()

  function addTimes(date: Date) {
    for (const time of times) {
      const [h, m] = time.split(':').map(Number)
      const dt = new Date(date)
      dt.setHours(h, m, 0, 0)
      result.push({ scheduledAt: dt.toISOString(), durationMinutes: duration })
    }
  }

  const start = new Date(fromDate + 'T00:00:00')
  const end = new Date(toDate + 'T23:59:59')

  if (pattern === 'weekly') {
    const cur = new Date(start)
    while (cur <= end) {
      if (selectedDays.has(cur.getDay())) addTimes(cur)
      cur.setDate(cur.getDate() + 1)
    }

  } else if (pattern === 'biweekly') {
    const cur = new Date(start)
    const startMs = start.getTime()
    while (cur <= end) {
      const weekOffset = Math.floor((cur.getTime() - startMs) / (7 * 24 * 60 * 60 * 1000))
      if (weekOffset % 2 === 0 && selectedDays.has(cur.getDay())) addTimes(cur)
      cur.setDate(cur.getDate() + 1)
    }

  } else if (pattern === 'monthly') {
    // First occurrence of each selected day per calendar month
    let year = start.getFullYear()
    let month = start.getMonth()
    const endYear = end.getFullYear()
    const endMonth = end.getMonth()

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const seen = new Set<number>() // track which day-of-week already used this month
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d)
        const dow = date.getDay()
        if (date >= start && date <= end && selectedDays.has(dow) && !seen.has(dow)) {
          seen.add(dow)
          addTimes(date)
        }
      }
      month++
      if (month > 11) { month = 0; year++ }
    }
  }

  return result
}

export default function CoachingAvailabilityPage() {
  const [slots, setSlots] = useState<SlotWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('recurring')

  // Recurring state
  const [pattern, setPattern] = useState<Pattern>('weekly')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]))
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set(['10:00', '14:00']))
  const [duration, setDuration] = useState('50')
  const [adding, setAdding] = useState(false)
  const [addMsg, setAddMsg] = useState<string | null>(null)
  const [addError, setAddError] = useState<string | null>(null)

  // Single day state
  const [singleDate, setSingleDate] = useState('')
  const [singleTimes, setSingleTimes] = useState<Set<string>>(new Set())
  const [singleDuration, setSingleDuration] = useState('50')
  const [singleAdding, setSingleAdding] = useState(false)
  const [singleMsg, setSingleMsg] = useState<string | null>(null)
  const [singleError, setSingleError] = useState<string | null>(null)

  // Bulk delete state
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  async function loadSlots() {
    const res = await fetch('/api/coaching/admin')
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoading(false)
  }

  useEffect(() => { loadSlots() }, [])

  const preview = buildRecurringSlots(fromDate, toDate, pattern, selectedDays, selectedTimes, Number(duration))

  async function addRecurring() {
    if (preview.length === 0) { setAddError('Configure your date range, days, and times first.'); return }
    setAdding(true); setAddError(null); setAddMsg(null)
    const res = await fetch('/api/coaching/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots: preview }),
    })
    const data = await res.json()
    if (!res.ok) { setAddError(data.error); setAdding(false); return }
    setAddMsg(`✓ Added ${data.count} slots`)
    await loadSlots()
    setAdding(false)
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

  async function deleteSelected() {
    if (selected.size === 0) return
    setBulkDeleting(true)
    await Promise.all(
      Array.from(selected).map(id =>
        fetch('/api/coaching/admin', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
      )
    )
    setSelected(new Set())
    await loadSlots()
    setBulkDeleting(false)
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
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
  const selectableUpcoming = upcoming.filter(s => !s.is_booked)
  const allUpcomingSelected = selectableUpcoming.length > 0 && selectableUpcoming.every(s => selected.has(s.id))
  const today = new Date().toISOString().split('T')[0]

  function selectAllUpcoming() {
    if (allUpcomingSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(selectableUpcoming.map(s => s.id)))
    }
  }

  const patternLabel: Record<Pattern, string> = {
    weekly: 'every week on selected days',
    biweekly: 'every other week on selected days',
    monthly: 'first occurrence of selected days each month',
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold">Coaching Session Availability</h1>
        <p className="text-muted-foreground mt-1">
          Add open 50-minute slots — visible to anyone on the Coaching page.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
        <button
          onClick={() => setTab('recurring')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'recurring' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          <RefreshCw className="h-4 w-4" /> Recurring
        </button>
        <button
          onClick={() => setTab('single')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'single' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          <Plus className="h-4 w-4" /> Single Day
        </button>
      </div>

      {/* RECURRING TAB */}
      {tab === 'recurring' && (
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-1">Set recurring availability</h2>
            <p className="text-sm text-muted-foreground">Choose a pattern, date range, days, and times.</p>
          </div>

          {/* Pattern */}
          <div className="space-y-2">
            <Label>Repeat pattern</Label>
            <div className="flex gap-2">
              {(['weekly', 'biweekly', 'monthly'] as Pattern[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize',
                    pattern === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted text-muted-foreground'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Generates slots {patternLabel[pattern]}.</p>
          </div>

          {/* Date range + duration */}
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
              <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="15" step="5" className="w-24" />
            </div>
          </div>

          {/* Days */}
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

          {/* Times */}
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

          {/* Preview + action */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex-1">
              {preview.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Will create <span className="font-semibold text-foreground">{preview.length} slots</span>
                  {' '}({pattern})
                </p>
              )}
              {addMsg && <p className="text-sm text-primary font-medium">{addMsg}</p>}
              {addError && <p className="text-sm text-destructive">{addError}</p>}
            </div>
            <Button onClick={addRecurring} disabled={adding || preview.length === 0}>
              {adding
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Adding...</>
                : <><RefreshCw className="h-4 w-4 mr-2" />Add {preview.length > 0 ? preview.length : ''} Slots</>}
            </Button>
          </div>
        </div>
      )}

      {/* SINGLE DAY TAB */}
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
                {singleAdding
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Adding...</>
                  : <><Plus className="h-4 w-4 mr-2" />Add {singleTimes.size > 0 ? singleTimes.size : ''} Slot{singleTimes.size !== 1 ? 's' : ''}</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING SLOTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Upcoming Slots ({upcoming.length})</h2>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelected}
                disabled={bulkDeleting}
              >
                {bulkDeleting
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deleting...</>
                  : <><Trash2 className="h-4 w-4 mr-2" />Delete {selected.size} selected</>}
              </Button>
            )}
            {selectableUpcoming.length > 0 && (
              <Button variant="ghost" size="sm" onClick={selectAllUpcoming} className="text-muted-foreground">
                {allUpcomingSelected
                  ? <><Square className="h-4 w-4 mr-1.5" />Deselect all</>
                  : <><CheckSquare className="h-4 w-4 mr-1.5" />Select all</>}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 border rounded-xl text-center">
            No upcoming slots — use the scheduler above to add some.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(slot => (
              <SlotRow
                key={slot.id}
                slot={slot}
                selected={selected.has(slot.id)}
                onToggleSelect={() => toggleSelect(slot.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* PAST SLOTS */}
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

function SlotRow({ slot, selected, onToggleSelect, past }: {
  slot: SlotWithBooking
  selected?: boolean
  onToggleSelect?: () => void
  past?: boolean
}) {
  const booking = slot.coaching_bookings?.[0]
  const dt = new Date(slot.scheduled_at)
  const canSelect = !past && !slot.is_booked

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors',
      slot.is_booked && 'border-primary/30 bg-primary/5',
      selected && 'border-destructive/40 bg-destructive/5'
    )}>
      {/* Checkbox */}
      <div className="flex items-center pt-0.5">
        {canSelect ? (
          <button onClick={onToggleSelect} className="text-muted-foreground hover:text-foreground transition-colors">
            {selected
              ? <CheckSquare className="h-4 w-4 text-destructive" />
              : <Square className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-4 h-4" />
        )}
      </div>

      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
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

      <Badge variant={slot.is_booked ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
        {slot.is_booked ? 'Booked' : 'Open'}
      </Badge>
    </div>
  )
}
