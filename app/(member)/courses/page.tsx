import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Lock, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Course } from '@/types'

export const metadata = { title: 'Courses' }

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: courses }, { data: subscription }, { data: purchases }] = await Promise.all([
    supabase
      .from('courses')
      .select('*, modules(count)')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('subscriptions')
      .select('*, membership_tiers(tier_level)')
      .eq('user_id', user!.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle(),
    supabase
      .from('course_purchases')
      .select('course_id')
      .eq('user_id', user!.id),
  ])

  const userTierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
  const purchasedIds = new Set((purchases ?? []).map((p: any) => p.course_id))

  function canAccess(course: Course): boolean {
    if (purchasedIds.has(course.id)) return true
    if (course.price !== null) return false // must purchase individually
    return userTierLevel >= (course.min_tier_level ?? 1)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Course Library</h1>
        <p className="text-muted-foreground mt-1">
          {userTierLevel > 0
            ? `Your ${(subscription as any)?.membership_tiers?.name ?? ''} membership includes courses up to Tier ${userTierLevel}`
            : 'Subscribe to access tier-included courses, or purchase individually'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {(courses as Course[])?.map(course => {
          const accessible = canAccess(course)
          const needsPurchase = !accessible && course.price !== null
          const needsUpgrade = !accessible && course.price === null

          return (
            <div
              key={course.id}
              className={`rounded-2xl border bg-card overflow-hidden flex flex-col ${!accessible ? 'opacity-80' : ''}`}
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-muted">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                {!accessible && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {course.min_tier_level && course.price === null && (
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    Tier {course.min_tier_level}+
                  </Badge>
                )}
                {course.price !== null && (
                  <Badge className="absolute top-3 left-3">
                    ${course.price}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {course.description}
                  </p>
                )}

                {accessible ? (
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.slug}`}>Start Learning</Link>
                  </Button>
                ) : needsPurchase ? (
                  <PurchaseButton course={course} />
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/pricing">
                      Upgrade to Access
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {(!courses || courses.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No courses yet</p>
          <p className="text-sm">Shira is working on courses — check back soon!</p>
        </div>
      )}
    </div>
  )
}

function PurchaseButton({ course }: { course: Course }) {
  'use client'
  return (
    <form action="/api/stripe/checkout" method="POST">
      <input type="hidden" name="courseId" value={course.id} />
      <Button type="submit" variant="outline" className="w-full">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Buy — ${course.price}
      </Button>
    </form>
  )
}
