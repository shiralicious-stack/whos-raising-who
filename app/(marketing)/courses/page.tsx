import { createClient } from '@/lib/supabase/server'
import { MarketingNav } from '@/components/marketing-nav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lock, ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Courses — Who\'s Raising Who',
  description: 'Self-paced and live group courses on conscious parenting, REparenting, triggers, and more.',
}

export default async function CoursesPage() {
  const supabase = await createClient()

  // Get user — may be null for public visitors
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: courses }, subscriptionResult, purchasesResult] = await Promise.all([
    supabase
      .from('courses')
      .select('*, modules(count)')
      .eq('published', true)
      .order('created_at', { ascending: false }),
    user
      ? supabase
          .from('subscriptions')
          .select('*, membership_tiers(tier_level)')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('course_purchases').select('course_id').eq('user_id', user.id)
      : Promise.resolve({ data: [] }),
  ])

  const userTierLevel = (subscriptionResult.data as any)?.membership_tiers?.tier_level ?? 0
  const purchasedIds = new Set(((purchasesResult.data ?? []) as any[]).map(p => p.course_id))

  function canAccess(course: any): boolean {
    if (!user) return false
    if (purchasedIds.has(course.id)) return true
    if (course.price !== null) return false
    return userTierLevel >= (course.min_tier_level ?? 1)
  }

  function lockReason(course: any): 'login' | 'upgrade' | 'purchase' | null {
    if (canAccess(course)) return null
    if (!user) return 'login'
    if (course.price !== null && !purchasedIds.has(course.id)) return 'purchase'
    return 'upgrade'
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-warm-50 via-background to-sage-50 py-24 md:py-28">
          <div className="container max-w-3xl text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">Courses</p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              Learn at your own pace.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Self-paced prerecorded courses and live group courses taught by Shira —
              on conscious parenting, triggers, REparenting, and more.
            </p>
          </div>
        </section>

        {/* Group courses — coming soon */}
        <section className="py-20 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-3xl font-bold">Live Group Courses</h2>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <div className="rounded-2xl border bg-card p-8 text-center">
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-6">
                Shira is building live group courses where you&apos;ll learn alongside other moms in real time.
                When a course is coming up, the date and sign-up will appear here.
              </p>
              <Button asChild variant="outline">
                <Link href="/pricing">Join the Community to Get Notified <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Course library */}
        <section className="py-24 bg-background">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-10">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-3xl font-bold">Course Library</h2>
              <Badge variant="secondary">Self-Paced</Badge>
            </div>

            {(!courses || courses.length === 0) ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Courses coming soon</p>
                <p className="text-sm mt-1">Shira is working on courses — check back soon!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {(courses as any[]).map(course => {
                  const accessible = canAccess(course)
                  const reason = lockReason(course)

                  return (
                    <div
                      key={course.id}
                      className={`rounded-2xl border bg-card overflow-hidden flex flex-col ${!accessible ? 'opacity-90' : ''}`}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-44 bg-muted">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                        {!accessible && (
                          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        {course.min_tier_level && course.price === null && (
                          <Badge className="absolute top-3 left-3" variant="secondary">Members</Badge>
                        )}
                        {course.price === 0 && (
                          <Badge className="absolute top-3 left-3" variant="secondary">Free</Badge>
                        )}
                        {course.price !== null && course.price > 0 && (
                          <Badge className="absolute top-3 left-3">${course.price}</Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                        {course.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{course.description}</p>
                        )}

                        {accessible ? (
                          <Button asChild className="w-full">
                            <Link href={`/courses/${course.slug}`}>Start Learning</Link>
                          </Button>
                        ) : reason === 'login' ? (
                          <Button asChild variant="outline" className="w-full">
                            <Link href={`/login?next=/courses/${course.slug}`}>Sign In to Access</Link>
                          </Button>
                        ) : reason === 'purchase' ? (
                          <form action="/api/stripe/checkout" method="POST">
                            <input type="hidden" name="courseId" value={course.id} />
                            <Button type="submit" variant="outline" className="w-full">Buy — ${course.price}</Button>
                          </form>
                        ) : (
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/pricing">Join to Access <Lock className="ml-2 h-3.5 w-3.5" /></Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bottom join CTA */}
            <div className="mt-14 rounded-2xl bg-secondary/40 border p-8 text-center">
              <h3 className="font-serif text-2xl font-bold mb-3">Unlock the full library</h3>
              <p className="text-muted-foreground mb-6">
                Community members get access to a growing library of courses and webinars — included with membership.
              </p>
              <Button asChild size="lg">
                <Link href="/pricing">See Membership Options <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">← Back to Home</Link>
          <span className="mx-4">·</span>
          <span>© {new Date().getFullYear()} Shira Finkelstein · Who&apos;s Raising Who</span>
        </div>
      </footer>
    </div>
  )
}
