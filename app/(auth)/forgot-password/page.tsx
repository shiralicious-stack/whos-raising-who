'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/settings`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3">Check your email</h2>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
          </p>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold mb-2">Reset your password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/login" className="text-primary hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
