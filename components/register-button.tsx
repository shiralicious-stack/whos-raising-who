'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface RegisterButtonProps {
  eventId: string
  userId: string
}

export function RegisterButton({ eventId, userId }: RegisterButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister() {
    setLoading(true)
    const { error } = await supabase.from('event_registrations').insert({
      event_id: eventId,
      user_id: userId,
    })
    if (error) {
      alert('Failed to register. Please try again.')
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button size="sm" onClick={handleRegister} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register'}
    </Button>
  )
}
