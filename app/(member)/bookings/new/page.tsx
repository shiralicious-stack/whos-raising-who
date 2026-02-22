import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/booking-form'

export const metadata = { title: 'Book a Session' }

export default async function NewBookingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // VIP-only
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, membership_tiers(tier_level)')
    .eq('user_id', user!.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle()

  const tierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
  if (tierLevel < 3) redirect('/bookings')

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Book a Session</h1>
        <p className="text-muted-foreground mt-1">
          Schedule your private 50-minute coaching session with Shira.
        </p>
      </div>
      <BookingForm userId={user!.id} />
    </div>
  )
}
