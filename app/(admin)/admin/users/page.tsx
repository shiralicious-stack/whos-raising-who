import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Admin — Members' }

export default async function AdminUsersPage() {
  const admin = createAdminClient()

  const { data: profiles } = await admin
    .from('profiles')
    .select(`
      *,
      subscriptions(
        status,
        interval,
        membership_tiers(name, tier_level)
      )
    `)
    .order('created_at', { ascending: false })

  const tierColor: Record<number, string> = {
    1: 'bg-gray-100 text-gray-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground mt-1">{profiles?.length ?? 0} total accounts</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Membership</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile: any) => {
              const activeSub = profile.subscriptions?.find((s: any) =>
                ['active', 'trialing'].includes(s.status)
              )
              return (
                <tr key={profile.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-4">
                    <p className="font-medium">{profile.full_name ?? '—'}</p>
                    {profile.role === 'admin' && (
                      <span className="text-xs text-primary font-medium">Admin</span>
                    )}
                  </td>
                  <td className="p-4">
                    {activeSub ? (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tierColor[activeSub.membership_tiers?.tier_level] ?? 'bg-gray-100 text-gray-700'}`}>
                        {activeSub.membership_tiers?.name} · {activeSub.interval}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No subscription</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={activeSub?.status === 'active' ? 'default' : 'outline'} className="text-xs">
                      {activeSub?.status ?? 'inactive'}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
