'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Video, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingWithProfile {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  notes: string | null
  daily_room_url: string | null
  profiles: { full_name: string | null } | null
}

interface BookingActionsPanelProps {
  bookings: BookingWithProfile[]
  showConfirmButton?: boolean
}

export function BookingActionsPanel({ bookings, showConfirmButton = true }: BookingActionsPanelProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function updateBooking(bookingId: string, status: string) {
    setLoading(bookingId)
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <table className="w-full">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Member</th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Date & Time</th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Notes</th>
            <th className="p-4" />
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id} className="border-b last:border-0">
              <td className="p-4 font-medium">
                {booking.profiles?.full_name ?? 'Unknown'}
              </td>
              <td className="p-4 text-sm">
                <p>{new Date(booking.scheduled_at).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric',
                })}</p>
                <p className="text-muted-foreground">
                  {new Date(booking.scheduled_at).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit',
                  })} · {booking.duration_minutes} min
                </p>
              </td>
              <td className="p-4 text-sm text-muted-foreground max-w-xs">
                {booking.notes ? (
                  <p className="truncate italic">&ldquo;{booking.notes}&rdquo;</p>
                ) : (
                  <span className="opacity-50">—</span>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 justify-end">
                  {booking.daily_room_url && (
                    <Button asChild variant="outline" size="sm">
                      <a href={booking.daily_room_url} target="_blank" rel="noopener noreferrer">
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Room
                      </a>
                    </Button>
                  )}
                  {showConfirmButton && (
                    <Button
                      size="sm"
                      onClick={() => updateBooking(booking.id, 'confirmed')}
                      disabled={loading === booking.id}
                    >
                      {loading === booking.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <><CheckCircle className="h-3.5 w-3.5 mr-1" />Confirm</>}
                    </Button>
                  )}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => updateBooking(booking.id, 'cancelled')}
                      disabled={loading === booking.id}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
