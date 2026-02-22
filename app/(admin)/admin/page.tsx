import { createClient } from '@/lib/supabase/server'
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalMembers },
    { count: activeSubscriptions },
    { count: totalCourses },
    { data: subsByTier },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'member'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase
      .from('subscriptions')
      .select('tier_id, membership_tiers(name, price_monthly)')
      .eq('status', 'active'),
  ])

  // Rough MRR calculation
  const mrr = (subsByTier ?? []).reduce((acc, sub) => {
    const tier = (sub.membership_tiers as unknown) as { price_monthly: number } | null
    return acc + (tier?.price_monthly ?? 0)
  }, 0)

  const stats = [
    { label: 'Total Members', value: totalMembers ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Active Subscriptions', value: activeSubscriptions ?? 0, icon: CreditCard, color: 'text-green-600' },
    { label: 'Published Courses', value: totalCourses ?? 0, icon: BookOpen, color: 'text-purple-600' },
    { label: 'Monthly Revenue (est.)', value: `$${mrr.toFixed(0)}`, icon: TrendingUp, color: 'text-primary' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <div className={`inline-flex p-2 rounded-lg bg-muted mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent subscriptions */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Recent Members</h2>
          <RecentMembers supabase={supabase} />
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Create a Course', href: '/admin/courses/new' },
              { label: 'Schedule an Event', href: '/admin/events/new' },
              { label: 'Review Bookings', href: '/admin/bookings' },
              { label: 'View All Members', href: '/admin/users' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors text-sm"
              >
                {label}
                <span className="text-muted-foreground">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function RecentMembers({ supabase }: { supabase: Awaited<ReturnType<typeof createClient>> }) {
  const { data: members } = await supabase
    .from('profiles')
    .select('full_name, created_at, role')
    .eq('role', 'member')
    .order('created_at', { ascending: false })
    .limit(5)

  if (!members || members.length === 0) {
    return <p className="text-sm text-muted-foreground">No members yet.</p>
  }

  return (
    <ul className="space-y-3">
      {members.map((m, i) => (
        <li key={i} className="flex items-center justify-between text-sm">
          <span className="font-medium">{m.full_name ?? 'Unknown'}</span>
          <span className="text-muted-foreground text-xs">
            {new Date(m.created_at).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  )
}
