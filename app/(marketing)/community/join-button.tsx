'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JoinButtonProps {
  children: React.ReactNode
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  className?: string
}

export function JoinButton({ children, size, variant, className }: JoinButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/community-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  )
}
