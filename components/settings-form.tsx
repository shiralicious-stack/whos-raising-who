'use client'

import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Subscription, MembershipTier } from '@/types'

interface SettingsFormProps {
  profile: Profile
  subscription: (Subscription & { membership_tiers: MembershipTier }) | null
  email: string
}

export function SettingsForm({ profile, subscription, email }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', profile.id)

    if (error) {
      setMessage('Failed to save. Please try again.')
    } else {
      setMessage('Profile updated successfully.')
    }
    setSaving(false)
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      alert('Could not open billing portal. Please try again.')
      setPortalLoading(false)
    }
  }

  const statusColor = {
    active: 'default',
    trialing: 'secondary',
    past_due: 'destructive',
    canceled: 'outline',
    incomplete: 'outline',
  } as const

  return (
    <div className="space-y-8">
      {/* Profile */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold text-lg mb-6">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
          {message && (
            <p className="text-sm text-primary">{message}</p>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </form>
      </div>

      {/* Subscription */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold text-lg mb-6">Membership</h2>

        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{subscription.membership_tiers.name} Plan</p>
                <p className="text-sm text-muted-foreground capitalize">
                  Billed {subscription.interval}
                </p>
              </div>
              <Badge variant={statusColor[subscription.status] ?? 'secondary'}>
                {subscription.status}
              </Badge>
            </div>

            {subscription.current_period_end && (
              <p className="text-sm text-muted-foreground">
                {subscription.cancel_at_period_end
                  ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
              </p>
            )}

            <Button
              variant="outline"
              onClick={handleManageBilling}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Billing
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-4">You don&apos;t have an active membership.</p>
            <Button asChild>
              <a href="/pricing">View Membership Plans</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
