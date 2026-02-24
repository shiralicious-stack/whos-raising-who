import { CoachingBookingForm } from '@/components/coaching-booking-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ArrowRight, Clock, Video, Users, Heart } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Coaching - Who\'s Raising Who',
  description: 'Individual and group coaching with Shira Finkelstein. Book a free consult or schedule a 50-minute coaching session.',
}

export default function CoachingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-warm-50 via-background to-sage-50 py-12 md:py-32">
          <div className="container max-w-3xl text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">Coaching</p>
            <h1 className="font-serif text-3xl md:text-6xl font-bold leading-tight mb-6">
              The work that changes everything.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Whether you&apos;re navigating a specific challenge or ready to go deep on your patterns -
              coaching with Shira meets you exactly where you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="#book-session">Book a Session <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link href="/book-call">Free 15-Min Consult First</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Two offerings */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Choose your path</h2>
              <p className="text-muted-foreground text-lg">Two ways to work with Shira directly.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Group Coaching */}
              <div className="rounded-2xl border bg-card p-5 md:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-sage-100 flex items-center justify-center mb-5">
                  <Users className="h-5 w-5 text-sage-600" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-serif text-2xl font-bold">Group Coaching</h3>
                  <Badge variant="secondary">Growth Tier</Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  A supportive group setting where you gain insights, share experiences, and grow alongside
                  other moms. Shira guides each session with intention and depth.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    'Live sessions with Shira and a small group',
                    'Understand your triggers and patterns',
                    'Shared growth and community support',
                    'Included in the Growth membership tier',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-sage-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing">See Membership Options <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>

              {/* 1:1 Coaching */}
              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 md:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-serif text-2xl font-bold">1:1 Coaching</h3>
                  <Badge>Most Popular</Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  Private, focused sessions with Shira - tailored entirely to your situation, your patterns,
                  and what you want to shift. The deepest level of support available.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    '50-minute private sessions with Shira',
                    'Tailored entirely to your unique situation',
                    'Deep dive into your inner world',
                    'Book directly - open to everyone',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link href="#book-session">Book a Session <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>

            </div>
          </div>
        </section>

        {/* Free consult CTA */}
        <section className="py-10 md:py-16 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-2">Not sure where to start?</h3>
                <p className="text-muted-foreground">Book a free 15-minute call with Shira to find the right fit.</p>
              </div>
              <Button asChild size="lg" variant="outline" className="flex-shrink-0">
                <Link href="/book-call">
                  <Clock className="mr-2 h-4 w-4" /> Free 15-Min Call
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Book a session */}
        <section id="book-session" className="py-12 md:py-24 bg-background">
          <div className="container max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Book a Coaching Session</h2>
              <p className="text-muted-foreground">50-minute private session with Shira. Open to everyone.</p>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/15 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-xl font-bold text-primary">S</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">Shira Finkelstein</p>
                    <p className="text-xs text-muted-foreground">Certified Conscious Parenting &amp; Life Coach</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> 50 minutes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5" /> Video call
                    </span>
                  </div>
                </div>
              </div>
              <CoachingBookingForm />
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
