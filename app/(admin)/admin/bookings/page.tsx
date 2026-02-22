import { createClient } from '@/lib/supabase/server'
import { BookingActionsPanel } from '@/components/admin/booking-actions'
import type { Booking } from '@/types'

export const metadata = { title: 'Admin — Bookings' }

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, profiles(full_name, avatar_url)')
    .order('scheduled_at', { ascending: true })

  const pending = (bookings as any[])?.filter(b => b.status === 'pending') ?? []
  const confirmed = (bookings as any[])?.filter(b => b.status === 'confirmed' && new Date(b.scheduled_at) > new Date()) ?? []
  const past = (bookings as any[])?.filter(b => b.status === 'completed' || (b.status === 'confirmed' && new Date(b.scheduled_at) <= new Date())) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">1:1 Bookings</h1>
        <p className="text-muted-foreground mt-1">
          {pending.length} pending · {confirmed.length} upcoming
        </p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 text-orange-600">Needs Your Response</h2>
          <BookingActionsPanel bookings={pending} />
        </div>
      )}

      {confirmed.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4">Confirmed &amp; Upcoming</h2>
          <BookingActionsPanel bookings={confirmed} showConfirmButton={false} />
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 text-muted-foreground">Past Sessions</h2>
          <BookingActionsPanel bookings={past} showConfirmButton={false} />
        </div>
      )}

      {!bookings || bookings.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">No bookings yet.</p>
      )}
    </div>
  )
}
