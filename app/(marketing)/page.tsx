import Link from 'next/link'
import { ArrowRight, Users, BookOpen, Heart, Star, CheckCircle2, Instagram, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarketingNav } from '@/components/marketing-nav'

const testimonials = [
  {
    name: 'Rachel M.',
    tier: 'Group Coaching Member',
    text: "Shira helped me see that my daughter's tantrums weren't the problem — my reactions were. The shift that happened in just a few weeks still amazes me. I feel like a different mom.",
  },
  {
    name: 'David K.',
    tier: '1:1 Coaching Client',
    text: "I came in skeptical — I'm a dad, not exactly the target audience. But Shira's approach gets to the root of things fast. I'm more patient, more present, and my kids feel it.",
  },
  {
    name: 'Maya S.',
    tier: 'Community Member',
    text: "The weekly meetups are the only place I feel truly understood as a mom. Nobody judges. Everyone grows. Shira creates something really rare here.",
  },
]

const services = [
  {
    icon: Users,
    title: 'Community',
    badge: null,
    badgeVariant: 'secondary' as const,
    description:
      'A warm, judgment-free space for mothers to share honestly, support one another, and grow together. Through weekly virtual gatherings and guided reflection, you\'ll be surrounded by women who truly understand this season of life.',
    features: [
      'Weekly virtual meetups',
      'Guided journaling prompts and reflection tools',
      'A safe space to speak openly without judgment',
      'Meaningful connection with like-minded mothers',
    ],
    cta: { label: 'Join the Community', href: '/pricing' },
    accent: 'border-sage-200 bg-sage-50/50',
    iconColor: 'text-sage-600',
    iconBg: 'bg-sage-100',
  },
  {
    icon: Heart,
    title: 'Individual Coaching',
    badge: 'Most Popular',
    badgeVariant: 'default' as const,
    description:
      'Group sessions or private one-on-one work with Shira — this is where real transformation happens. Understand your triggers, break generational patterns, and respond from intention.',
    features: [
      'Live group coaching sessions with Shira',
      'Private 1:1 sessions (VIP tier)',
      'Deep dive into your triggers & inner patterns',
      'Practical tools to break cycles — for good',
    ],
    cta: { label: 'Explore Coaching', href: '/pricing' },
    accent: 'border-primary/20 bg-primary/5',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    icon: BookOpen,
    title: 'Courses',
    badge: 'Self-Paced & Live',
    badgeVariant: 'outline' as const,
    description:
      'Learn on your own schedule with prerecorded self-paced courses, or join Shira live in group courses where you learn alongside other moms in real time.',
    features: [
      'Self-paced prerecorded video courses',
      'Live group courses taught by Shira',
      'Topics: big feelings, triggers, transitions & more',
      'Courses never expire — revisit anytime',
    ],
    cta: { label: 'Browse Courses', href: '/courses' },
    accent: 'border-warm-200 bg-warm-50/50',
    iconColor: 'text-warm-700',
    iconBg: 'bg-warm-100',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1">

        {/* 1. Hero */}
        <section className="relative overflow-hidden pt-24 pb-14 md:pt-32 md:pb-20">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: '120%', backgroundPosition: '65% 30%' }}
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container max-w-3xl text-center">
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight md:text-7xl text-white mb-6">
              Who&apos;s Raising{' '}
              <span className="text-primary">Who?</span>
            </h1>
            <p className="text-xl font-medium text-white/90 mb-4">
              Because parenting begins with you.
            </p>
            <p className="text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mb-12">
              To raise emotionally healthy children, we must first understand ourselves.
              Our children reflect our unhealed parts back to us — and that&apos;s the invitation.
            </p>
            <Button asChild size="lg" className="text-base px-10">
              <Link href="/pricing">Join the Community</Link>
            </Button>
            <p className="mt-5">
              <Link
                href="/book-call"
                className="text-sm text-white/70 underline underline-offset-4 hover:text-white transition-colors"
              >
                Book a Free Call
              </Link>
            </p>
          </div>
        </section>

        {/* 2. Emotional Anchor */}

        <section className="py-12 bg-background border-y border-border/50">
          <div className="container max-w-2xl text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground leading-relaxed mb-4">
              Motherhood was never meant to be done alone.
            </p>
            <p className="font-serif text-2xl md:text-3xl text-muted-foreground">
              Healing doesn&apos;t happen in isolation.
            </p>
          </div>
        </section>

        {/* 3. How We Work Together */}
        <section className="pt-12 pb-16 bg-secondary/20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5">
                Your Path Forward
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Whether you&apos;re seeking community, private support, or self-paced learning — there&apos;s a path for you here.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {services.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.title} className={`flex flex-col rounded-2xl border p-8 bg-card ${s.accent}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 ${s.iconBg}`}>
                      <Icon className={`h-5 w-5 ${s.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-serif text-2xl font-bold">{s.title}</h3>
                      {s.badge && (
                        <Badge variant={s.badgeVariant} className="text-xs">{s.badge}</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      {s.description}
                    </p>
                    <ul className="space-y-2.5 mb-8">
                      {s.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${s.iconColor}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full mt-auto">
                      <Link href={s.cta.href}>
                        {s.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 4. About Shira */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-warm-100 via-warm-50 to-sage-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-primary/15 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-5xl font-bold text-primary">S</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Shira Finkelstein</p>
                  <p className="text-xs text-muted-foreground">Certified Conscious Parenting Coach</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">About Shira</p>
                <h2 className="font-serif text-4xl font-bold mb-6 leading-snug">
                  Parenting begins with you.
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                  <p>
                    I&apos;m Shira Finkelstein — a Certified Conscious Parenting &amp; Life Coach
                    trained by Dr. Shefali Tsabary, and a single mom who walks this path every day.
                  </p>
                  <p>
                    I created Who&apos;s Raising Who because the most powerful parenting work happens
                    when we turn inward. Our children mirror our patterns, fears, and unhealed wounds.
                    When we do the inner work, everything shifts.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/about">Read My Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Free Call */}
        <section className="py-24 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-xl text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Not sure where to begin?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Book a free 15-minute consult call with Shira.
            </p>
            <Button asChild size="lg" className="px-10">
              <Link href="/book-call">Schedule Your Free Call</Link>
            </Button>
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="py-32 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">
                What Moms Are Saying
              </h2>
              <p className="text-muted-foreground">
                Nobody has it all figured out — and we&apos;re not meant to do this alone.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div key={t.name} className="flex flex-col p-7 rounded-2xl border bg-card">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6 flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.tier}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="py-28 bg-primary text-primary-foreground">
          <div className="container text-center max-w-2xl">
            <h2 className="font-serif text-4xl font-bold mb-6">
              Ready to do the real work?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Connect, heal, and grow alongside other moms who get it.
              Start your membership today — cancel anytime.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-base px-10">
              <Link href="/pricing">
                See Membership Options <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-14 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <p className="font-serif text-lg font-bold mb-2">Who&apos;s Raising Who</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Conscious parenting community & coaching for moms who are ready to break cycles and do the real work.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="https://instagram.com/whos_raising_who" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://facebook.com/WhosRaisingWhoShira" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://tiktok.com/@whos_raising_who" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="TikTok">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                </a>
                <a href="https://substack.com/@whosraisingwho" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-xs font-bold" aria-label="Substack">
                  S
                </a>
              </div>
            </div>

            <div className="flex gap-12 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Explore</p>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">About Shira</Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors">Membership</Link>
                <Link href="/courses" className="block text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
                <Link href="/book-call" className="block text-muted-foreground hover:text-foreground transition-colors">Free Consult Call</Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Account</p>
                <Link href="/login" className="block text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/signup" className="block text-muted-foreground hover:text-foreground transition-colors">Join Now</Link>
                <a href="mailto:hello@whosraisingwho.com" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Shira Finkelstein · Who&apos;s Raising Who</p>
            <p>561-767-9113 · hello@whosraisingwho.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
