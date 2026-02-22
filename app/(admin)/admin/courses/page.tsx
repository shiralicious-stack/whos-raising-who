import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, EyeOff, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Course } from '@/types'

export const metadata = { title: 'Admin — Courses' }

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(count)')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">{courses?.length ?? 0} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        {!courses || courses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="mb-4">No courses yet. Create your first course to get started.</p>
            <Button asChild variant="outline">
              <Link href="/admin/courses/new">Create Course</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Title</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Price</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Tier</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {(courses as (Course & { modules: [{ count: number }] })[]).map(course => (
                <tr key={course.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">/courses/{course.slug}</p>
                  </td>
                  <td className="p-4 text-sm">
                    {course.price !== null ? `$${course.price}` : 'Tier-included'}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">Tier {course.min_tier_level}+</Badge>
                  </td>
                  <td className="p-4">
                    {course.published ? (
                      <span className="flex items-center gap-1.5 text-sm text-green-600">
                        <Eye className="h-3.5 w-3.5" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <EyeOff className="h-3.5 w-3.5" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
