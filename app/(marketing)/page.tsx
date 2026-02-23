import Link from 'next/link'
import { ArrowRight, Heart, Users, BookOpen, Video, Star, CheckCircle2, Instagram, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarketingNav } from '@/components/marketing-nav'
import { ServicesSection } from '@/components/services-section'

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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-background to-sage-50 py-24 md:py-36">
          <div className="container max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              Conscious Parenting · Coaching · Community
            </Badge>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight md:text-7xl text-foreground mb-6">
              Who&apos;s Raising{' '}
              <span className="text-primary">Who?</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
              Because parenting begins with you.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              To raise emotionally healthy children, we must first understand ourselves.
              Our kids reflect our most unhealed parts back to us — and that&apos;s the invitation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/pricing">
                  Join the Community <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/book-call">Book a Free Call</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Motherhood is not meant to be walked alone.
            </p>
          </div>
        </section>

        {/* Free intro call strip */}
        <section className="py-10 bg-secondary/40 border-y">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl">
            <div>
              <p className="font-semibold">Not sure if this is right for you?</p>
              <p className="text-sm text-muted-foreground">Book a free 30-minute consult call with Shira — no pressure, no pitch.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="flex-shrink-0">
              <Link href="/book-call">Book a Free Call</Link>
            </Button>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 bg-background">
          <div className="container max-w-3xl text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">The foundation</p>
            <blockquote className="font-serif text-3xl md:text-4xl font-bold leading-snug mb-6">
              &ldquo;Breaking cycles with our children begins with us doing our own inner work.&rdquo;
            </blockquote>
            <p className="text-muted-foreground text-lg leading-relaxed">
              True change in parenting begins with our own healing. When we understand our triggers,
              our patterns, and our own unmet needs — we stop reacting and start responding.
              That&apos;s the REparenting journey, and it changes everything.
            </p>
          </div>
        </section>

        {/* Services — tabbed */}
        <section id="services" className="py-24 bg-secondary/20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">How we work together</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Whether you&apos;re just starting out or ready to go deep — there&apos;s a place for you here.
              </p>
            </div>
            <ServicesSection />
          </div>
        </section>

        {/* About Shira */}
        <section id="about" className="py-24 bg-background">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
                <Badge variant="outline" className="mb-4">Your Guide</Badge>
                <h2 className="font-serif text-4xl font-bold mb-4">
                  Hi, I&apos;m Shira
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I&apos;m a Certified Conscious Parenting &amp; Life Coach, trained by Dr. Shefali Tsabary —
                  one of the world&apos;s foremost authorities on conscious parenting.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I created Who&apos;s Raising Who because I believe the most powerful parenting work
                  happens when we turn the lens on ourselves. Our kids mirror us — our fears, our
                  patterns, our unhealed wounds. When we do the inner work, they feel it.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  As a single mom, I know firsthand how hard this path can be — and how transformative
                  it becomes when you stop trying to do it alone.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Certified Conscious Parenting & Life Coach',
                    'Trained by Dr. Shefali Tsabary',
                    'Specializing in REparenting & breaking generational cycles',
                    'Single mom who walks this path every day',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline">
                  <Link href="/about">Read Full Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-secondary/20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">
                What moms are saying
              </h2>
              <p className="text-muted-foreground">Nobody has it all figured out — and we&apos;re not meant to do this alone.</p>
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
              Connect, heal, and grow alongside other moms who get it.
              Start your membership today — cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-base px-10">
                <Link href="/pricing">
                  See Membership Options <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/book-call">Book a Free Call First</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Brand */}
            <div>
              <p className="font-serif text-lg font-bold mb-2">Who&apos;s Raising Who</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Conscious parenting coaching for moms who are ready to break cycles and do the real work.
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

            {/* Links */}
            <div className="flex gap-12 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Explore</p>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">About Shira</Link>
                <Link href="/#services" className="block text-muted-foreground hover:text-foreground transition-colors">Services</Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors">Membership</Link>
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
