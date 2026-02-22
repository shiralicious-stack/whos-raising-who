'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(next)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your Who&apos;s Raising Who account
          </p>
        </div>

        <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
