export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MemberNav } from '@/components/member-nav'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background flex">
      <MemberNav profile={profile} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
