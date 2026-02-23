'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MembershipTier } from '@/types'

interface PricingCardsProps {
  tiers: MembershipTier[]
}

export function PricingCards({ tiers }: PricingCardsProps) {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(tier: MembershipTier) {
    setLoading(tier.id)
    try {
      const priceId =
        interval === 'monthly'
          ? tier.stripe_price_id_monthly
          : tier.stripe_price_id_annual

      if (!priceId) {
        alert('This plan is not yet available for purchase. Please check back soon.')
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tierId: tier.id }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const annualSavings = (tier: MembershipTier) => {
    const monthly = tier.price_monthly * 12
    const annual = tier.price_annual
    return Math.round(((monthly - annual) / monthly) * 100)
  }

  return (
    <div>
      {/* Interval toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <button
          onClick={() => setInterval('monthly')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            interval === 'monthly'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setInterval('annual')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            interval === 'annual'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Annual{' '}
          <span className="text-xs opacity-80">save ~17%</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier) => {
          const isPopular = tier.tier_level === 2
          const price =
            interval === 'monthly' ? tier.price_monthly : tier.price_annual / 12
          const savings = annualSavings(tier)

          return (
            <div
              key={tier.id}
              className={cn(
                'relative rounded-2xl border p-8 flex flex-col',
                isPopular
                  ? 'border-2 border-primary shadow-xl bg-card'
                  : 'border-border bg-card'
              )}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4">
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold mb-2">{tier.name}</h2>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ${price.toFixed(0)}
                  </span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {interval === 'annual' && (
                  <p className="text-sm text-primary mt-1">
                    Billed ${tier.price_annual}/year · save {savings}%
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {(tier.features as string[]).map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(tier)}
                disabled={loading === tier.id}
                variant={isPopular ? 'default' : 'outline'}
                className="w-full"
                size="lg"
              >
                {loading === tier.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Start ${tier.name}`
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
