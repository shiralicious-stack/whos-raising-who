import { MarketingNav } from '@/components/marketing-nav'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Events — Who\'s Raising Who',
  description: 'In-person and virtual events, workshops, and retreats with Shira Finkelstein.',
}

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-warm-50 via-background to-sage-50 py-24 md:py-32">
          <div className="container max-w-3xl text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">Events</p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              Come together.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              In-person and virtual events, workshops, and retreats designed for moms
              who are ready to grow, connect, and breathe.
            </p>
          </div>
        </section>

        {/* Coming soon */}
        <section className="py-32 bg-background">
          <div className="container max-w-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4">Events coming soon</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Shira is planning workshops, virtual retreats, and in-person gatherings.
              Join the community to be the first to hear when something is announced.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/pricing">Join the Community <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link href="/book-call">Book a Free Call</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What to expect */}
        <section className="py-24 bg-secondary/20 border-t border-border/50">
          <div className="container max-w-3xl">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl font-bold mb-4">What to expect</h2>
              <p className="text-muted-foreground">When events are live, here&apos;s what you&apos;ll find.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Calendar, title: 'Virtual Workshops', description: 'Live online sessions focused on a specific topic — triggers, big feelings, transitions, and more.' },
                { icon: MapPin, title: 'In-Person Retreats', description: 'Full-day or weekend gatherings that blend personal growth work with genuine connection and rest.' },
                { icon: Users, title: 'Community Events', description: 'Casual virtual hangouts, Q&As with Shira, and special sessions just for community members.' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="p-6 rounded-2xl border bg-card text-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
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
