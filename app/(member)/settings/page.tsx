import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/settings-form'
import type { Profile, Subscription, MembershipTier } from '@/types'

export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase
      .from('subscriptions')
      .select('*, membership_tiers(*)')
      .eq('user_id', user!.id)
      .in('status', ['active', 'past_due', 'trialing'])
      .maybeSingle(),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and subscription</p>
      </div>
      <SettingsForm
        profile={profile as Profile}
        subscription={subscription as (Subscription & { membership_tiers: MembershipTier }) | null}
        email={user!.email!}
      />
    </div>
  )
}
