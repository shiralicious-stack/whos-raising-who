'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, BookOpen, Video, Heart, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const services = [
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    badge: 'Free',
    badgeVariant: 'secondary' as const,
    headline: 'You don\'t have to do this alone',
    description: 'A safe, supportive space for moms to share wins, challenges, and real moments from the week. No judgment. Just women who get it.',
    features: [
      'Weekly virtual meetups for moms',
      'Safe space to share openly without judgment',
      'Inspirational content, mantras & journaling prompts from Shira',
      'Connect with like-minded moms on the same journey',
      'Always free - because community shouldn\'t cost money',
    ],
    cta: { label: 'Join Free', href: '/signup' },
    color: 'text-sage-600',
    bg: 'bg-sage-50',
  },
  {
    id: 'group',
    label: 'Group Coaching',
    icon: Heart,
    badge: 'Growth Tier',
    badgeVariant: 'default' as const,
    headline: 'Connect, heal, and grow together',
    description: 'A supportive group setting where you gain insights, share experiences, and lift each other up as you navigate parenting while REparenting yourself.',
    features: [
      'Live group coaching sessions with Shira',
      'Understand your triggers, emotions, and patterns',
      'Develop awareness-based responses instead of reactive ones',
      'Uncover and transform limiting generational patterns',
      'Build greater compassion, connection & joy at home',
    ],
    cta: { label: 'See Membership Options', href: '/pricing' },
    color: 'text-primary',
    bg: 'bg-primary/5',
  },
  {
    id: 'coaching',
    label: '1:1 Coaching',
    icon: Video,
    badge: 'VIP Tier',
    badgeVariant: 'default' as const,
    headline: 'Personalized guidance just for you',
    description: 'Private, one-on-one sessions with Shira designed to go deep on your specific patterns, triggers, and the family dynamics you want to shift.',
    features: [
      'Private 50-minute sessions directly with Shira',
      'Tailored approach to your unique situation',
      'Deep dive into your inner world and unconscious patterns',
      'Practical tools to break cycles - for good',
      'One session per month included in VIP membership',
    ],
    cta: { label: 'Book a Free Consult', href: '/book-call' },
    color: 'text-primary',
    bg: 'bg-primary/5',
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: BookOpen,
    badge: 'All Tiers',
    badgeVariant: 'secondary' as const,
    headline: 'Learn at your own pace',
    description: 'Free and paid courses, masterclasses, and webinars designed to inspire growth and conscious parenting - available whenever you need them.',
    features: [
      'Self-paced video courses on conscious parenting topics',
      'Masterclasses and webinars with Shira',
      'Always available - courses never expire',
      'Topics include big feelings, transitions, sleep, triggers & more',
      'Free courses included with community membership',
    ],
    cta: { label: 'Browse Courses', href: '/courses' },
    color: 'text-warm-700',
    bg: 'bg-warm-50',
  },
  {
    id: 'events',
    label: 'Events & Retreats',
    icon: MapPin,
    badge: 'Coming Soon',
    badgeVariant: 'outline' as const,
    headline: 'Come together in person',
    description: 'In-person gatherings for moms to grow, learn, and reconnect with themselves and each other - blending personal growth with genuine connection, laughter, and fun.',
    features: [
      'In-person retreats and day events',
      'Blend of personal growth work and real connection',
      'Laughter, fun, and sisterhood',
      'Locations to be announced',
      'Priority access for VIP members',
    ],
    cta: { label: 'View Events', href: '/events' },
    color: 'text-sage-600',
    bg: 'bg-sage-50',
  },
]

export function ServicesSection() {
  const [active, setActive] = useState('community')
  const current = services.find(s => s.id === active)!

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {services.map(s => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
                active === s.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Active panel */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className={cn('px-8 py-6', current.bg)}>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={current.badgeVariant}>{current.badge}</Badge>
          </div>
          <h3 className="font-serif text-3xl font-bold mb-3">{current.headline}</h3>
          <p className="text-muted-foreground leading-relaxed max-w-xl">{current.description}</p>
        </div>
        <div className="px-8 py-6">
          <ul className="grid sm:grid-cols-2 gap-3 mb-6">
            {current.features.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className={cn('h-4 w-4 flex-shrink-0 mt-0.5', current.color)} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Button asChild>
            <Link href={current.cta.href}>
              {current.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
