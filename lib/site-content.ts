import { createClient } from '@supabase/supabase-js'

// Uses a stateless anon client — no cookies, no session management.
// site_content has a public read policy so no auth is needed.
function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function getPageContent(page: string): Promise<Record<string, string>> {
  try {
    const supabase = getAnonClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .eq('page', page)
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  } catch {
    return {}
  }
}
