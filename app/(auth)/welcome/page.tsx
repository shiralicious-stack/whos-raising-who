'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function WelcomeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!sessionId) {
      setVerifying(false)
      setVerifyError('No payment session found. Please start from the community page.')
      return
    }

    fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.verified) {
          setVerified(true)
          if (data.email) {
            setCustomerEmail(data.email)
            setEmail(data.email)
          }
        } else {
          setVerifyError(data.error || 'Could not verify your payment. Please contact support.')
        }
      })
      .catch(() => {
        setVerifyError('Could not verify your payment. Please try again.')
      })
      .finally(() => setVerifying(false))
  }, [sessionId])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          stripe_checkout_session_id: sessionId,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (verifyError) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-6">{verifyError}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/community">Back to Community</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3">Check your email</h2>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then come back to sign in.
          </p>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/login">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        {verified && (
          <div className="flex items-center gap-3 bg-primary/10 rounded-lg p-3 mb-6">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm text-primary font-medium">Payment received! Now create your account.</p>
          </div>
        )}

        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold mb-2">Welcome to the community</h1>
          <p className="text-muted-foreground text-sm">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              readOnly={!!customerEmail}
            />
            {customerEmail && (
              <p className="text-xs text-muted-foreground">
                Using the email from your payment
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
        </div>
      }
    >
      <WelcomeForm />
    </Suspense>
  )
}
