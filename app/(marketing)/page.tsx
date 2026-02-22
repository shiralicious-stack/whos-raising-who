import Link from 'next/link'
import { ArrowRight, Heart, Users, BookOpen, Video, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarketingNav } from '@/components/marketing-nav'

const testimonials = [
  {
    name: 'Rachel M.',
    tier: 'Growth Member',
    text: "Shira's approach changed how I see myself as a parent. The live group calls feel like a warm, judgment-free space. I finally feel less alone.",
  },
  {
    name: 'David K.',
    tier: 'VIP Member',
    text: "The 1:1 sessions are worth every penny. Shira sees things clearly and helps me get unstuck fast. I'm a better dad because of this community.",
  },
  {
    name: 'Maya S.',
    tier: 'Community Member',
    text: "I did the 'Big Feelings' course in a weekend. My 6-year-old's tantrums are now manageable. I feel equipped instead of panicked.",
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Pre-Recorded Courses',
    description: 'Learn at your own pace. Courses on big feelings, boundaries, sleep, transitions, and more — always available, never expire.',
  },
  {
    icon: Video,
    title: 'Live Coaching & Webinars',
    description: 'Monthly webinars, weekly group coaching calls, and 1:1 sessions with Shira — real-time support when you need it.',
  },
  {
    icon: Users,
    title: 'Real Community',
    description: 'You\'re not alone. Connect with parents at every stage, share wins and struggles, and grow together.',
  },
  {
    icon: Heart,
    title: 'Grounded in Relationship',
    description: 'Every tool and framework here is rooted in connection — with your kids, your partner, and most importantly, yourself.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-background to-sage-50 py-24 md:py-36">
          <div className="container max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              A parenting community unlike any other
            </Badge>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight md:text-7xl text-foreground mb-6">
              Who&apos;s Raising{' '}
              <span className="text-primary">Who?</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Because our kids raise us too. Join a community of parents doing the real work —
              understanding ourselves, staying connected, and growing alongside our children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/pricing">
                  Explore Membership <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="#features">See What&apos;s Inside</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Cancel anytime · No commitment required · Start for as little as $19/mo
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">
                Everything you need to show up fully
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Courses, live coaching, and community — all in one place, designed around your real life.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-5 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Shira */}
        <section className="py-24 bg-secondary/30">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-warm-100 via-warm-50 to-sage-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-primary/15 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-5xl font-bold text-primary">S</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Shira Finkelstein</p>
                  <p className="text-xs text-muted-foreground">Family Coach</p>
                </div>
              </div>
              <div>
                <Badge variant="outline" className="mb-4">Your Guide</Badge>
                <h2 className="font-serif text-4xl font-bold mb-4">
                  Hi, I&apos;m Shira
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I&apos;m a certified family coach, speaker, and mom. For over a decade, I&apos;ve been
                  helping parents move from reactive to responsive — building families grounded in
                  connection, not control.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  I created Who&apos;s Raising Who because I believe the most powerful parenting work
                  happens when we turn the lens on ourselves. Our kids mirror us. When we grow, they do too.
                </p>
                <ul className="space-y-3">
                  {['Certified Family & Parent Coach', 'Trained in RIE and Positive Discipline', 'Speaker at TEDx and national conferences', 'Mama to 3 kids who teach me everything'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">
                What parents are saying
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="flex flex-col p-6 rounded-2xl border bg-card">
                  <div className="flex gap-1 mb-4">
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

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container text-center max-w-2xl">
            <h2 className="font-serif text-4xl font-bold mb-6">
              Ready to do the real work?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Join hundreds of parents building stronger families from the inside out.
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
      <footer className="border-t py-12 bg-background">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-serif text-lg font-bold">Who&apos;s Raising Who</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Membership</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="mailto:hello@whosraisingwho.com" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shira Finkelstein. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
