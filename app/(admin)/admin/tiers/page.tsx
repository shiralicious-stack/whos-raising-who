import { createClient } from '@/lib/supabase/server'
import { TierEditor } from '@/components/admin/tier-editor'
import type { MembershipTier } from '@/types'

export const metadata = { title: 'Admin — Membership Tiers' }

export default async function AdminTiersPage() {
  const supabase = await createClient()
  const { data: tiers } = await supabase
    .from('membership_tiers')
    .select('*')
    .order('tier_level', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Membership Tiers</h1>
        <p className="text-muted-foreground mt-1">
          Set prices and Stripe Price IDs for each tier.{' '}
          <a
            href="https://dashboard.stripe.com/products"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Manage products in Stripe →
          </a>
        </p>
      </div>
      <TierEditor tiers={(tiers as MembershipTier[]) ?? []} />
    </div>
  )
}
