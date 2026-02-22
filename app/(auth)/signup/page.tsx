'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
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

  if (success) {
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
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Start your journey with Who&apos;s Raising Who
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
            />
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
