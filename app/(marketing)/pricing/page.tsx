import { createClient } from '@/lib/supabase/server'
import { PricingCards } from '@/components/pricing-cards'
import { Badge } from '@/components/ui/badge'
import type { MembershipTier } from '@/types'

export const metadata = {
  title: 'Membership',
  description: 'Choose the plan that fits where you are right now.',
}

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: tiers } = await supabase
    .from('membership_tiers')
    .select('*')
    .eq('is_active', true)
    .order('tier_level', { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-warm-50 via-background to-sage-50 py-20 text-center">
        <Badge variant="secondary" className="mb-4">Simple, Honest Pricing</Badge>
        <h1 className="font-serif text-5xl font-bold mb-4">
          Choose Your Path
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Every tier includes community access. Go deeper when you&apos;re ready.
          Cancel or change anytime — no pressure, no games.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container py-16">
        <PricingCards tiers={(tiers as MembershipTier[]) ?? []} />
      </div>

      {/* FAQ */}
      <div className="container max-w-2xl pb-20">
        <h2 className="font-serif text-3xl font-bold text-center mb-10">
          Common Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: 'Can I switch tiers?',
              a: 'Yes — upgrade or downgrade anytime from your account settings. Changes take effect on your next billing date.',
            },
            {
              q: 'What happens to my courses if I cancel?',
              a: 'Courses you purchased individually are yours to keep. Tier-included courses become inaccessible until you re-subscribe.',
            },
            {
              q: 'Is there a free trial?',
              a: "Not currently, but Community tier is just $19/mo — a low-risk way to see if it's a fit before going deeper.",
            },
            {
              q: 'Are 1:1 sessions really with Shira?',
              a: "Yes — every VIP session is directly with Shira, not an associate. VIP members get one 50-min session per month included.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border rounded-xl p-6">
              <h3 className="font-semibold mb-2">{q}</h3>
              <p className="text-muted-foreground text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
