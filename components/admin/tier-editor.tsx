'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import type { MembershipTier } from '@/types'

interface TierEditorProps {
  tiers: MembershipTier[]
}

export function TierEditor({ tiers: initialTiers }: TierEditorProps) {
  const supabase = createClient()
  const [tiers, setTiers] = useState(initialTiers)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  function updateTier(id: string, field: keyof MembershipTier, value: unknown) {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  async function saveTier(tier: MembershipTier) {
    setSaving(tier.id)
    const { error } = await supabase
      .from('membership_tiers')
      .update({
        price_monthly: tier.price_monthly,
        price_annual: tier.price_annual,
        stripe_price_id_monthly: tier.stripe_price_id_monthly,
        stripe_price_id_annual: tier.stripe_price_id_annual,
        name: tier.name,
        description: tier.description,
      })
      .eq('id', tier.id)

    setSaving(null)
    if (!error) {
      setSaved(tier.id)
      setTimeout(() => setSaved(null), 2000)
    } else {
      alert('Save failed: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      {tiers.map(tier => (
        <div key={tier.id} className="rounded-xl border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Tier {tier.tier_level} - {tier.name}</h2>
            </div>
            <Button
              size="sm"
              onClick={() => saveTier(tier)}
              disabled={saving === tier.id}
              variant={saved === tier.id ? 'secondary' : 'default'}
            >
              {saving === tier.id
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : saved === tier.id ? '✓ Saved' : 'Save'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`tier-name-${tier.id}`}>Display Name</Label>
              <Input
                id={`tier-name-${tier.id}`}
                value={tier.name}
                onChange={e => updateTier(tier.id, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`tier-desc-${tier.id}`}>Description</Label>
              <Input
                id={`tier-desc-${tier.id}`}
                value={tier.description ?? ''}
                onChange={e => updateTier(tier.id, 'description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`tier-monthly-${tier.id}`}>Monthly Price ($)</Label>
              <Input
                id={`tier-monthly-${tier.id}`}
                type="number"
                step="0.01"
                value={tier.price_monthly}
                onChange={e => updateTier(tier.id, 'price_monthly', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`tier-annual-${tier.id}`}>Annual Price ($)</Label>
              <Input
                id={`tier-annual-${tier.id}`}
                type="number"
                step="0.01"
                value={tier.price_annual}
                onChange={e => updateTier(tier.id, 'price_annual', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`tier-stripe-monthly-${tier.id}`}>Stripe Price ID - Monthly</Label>
              <Input
                id={`tier-stripe-monthly-${tier.id}`}
                value={tier.stripe_price_id_monthly ?? ''}
                onChange={e => updateTier(tier.id, 'stripe_price_id_monthly', e.target.value)}
                placeholder="price_..."
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`tier-stripe-annual-${tier.id}`}>Stripe Price ID - Annual</Label>
              <Input
                id={`tier-stripe-annual-${tier.id}`}
                value={tier.stripe_price_id_annual ?? ''}
                onChange={e => updateTier(tier.id, 'stripe_price_id_annual', e.target.value)}
                placeholder="price_..."
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
