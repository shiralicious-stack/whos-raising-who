import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Instagram, Facebook } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Shira - Who\'s Raising Who',
  description: 'Certified Conscious Parenting & Life Coach, trained by Dr. Shefali Tsabary. Learn about Shira\'s story, approach, and mission.',
}

const values = [
  {
    title: 'REparenting',
    description: 'The work isn\'t just about your kids - it\'s about healing the parts of yourself that never got what they needed. As you heal, your parenting transforms.',
  },
  {
    title: 'Conscious Parenting',
    description: 'Parenting from a place of awareness and intention, not reaction. Understanding why you do what you do - and choosing differently when it no longer serves you.',
  },
  {
    title: 'Breaking Cycles',
    description: 'The patterns we carry - anxiety, control, disconnection - often come from our own upbringing. The cycle ends when we decide to do the inner work.',
  },
  {
    title: 'Community Over Isolation',
    description: 'Motherhood is not meant to be walked alone. Real growth happens in community - where we can be honest, vulnerable, and supported.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-warm-50 via-background to-sage-50 py-20">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">About Shira</Badge>
                <h1 className="font-serif text-5xl font-bold leading-tight mb-6">
                  Parenting begins with you.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  I&apos;m Shira Finkelstein - a Certified Conscious Parenting &amp; Life Coach,
                  single mom, and someone who&apos;s done (and continues to do) the hard inner work
                  this path requires.
                </p>
                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/book-call">Book a Free Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/pricing">See Memberships</Link>
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-warm-100 via-warm-50 to-sage-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-primary/15 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-5xl font-bold text-primary">S</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Shira Finkelstein</p>
                  <p className="text-xs text-muted-foreground">Certified Conscious Parenting Coach</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-background">
          <div className="container max-w-2xl">
            <h2 className="font-serif text-3xl font-bold mb-6">My story</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I didn&apos;t set out to become a parenting coach. I set out to become a better parent -
                and that path led me somewhere I never expected: inward.
              </p>
              <p>
                Like so many moms, I started noticing that my reactions to my kids didn&apos;t always make
                sense. The intensity of my frustration when things went sideways, the guilt after I snapped,
                the feeling that I was somehow repeating patterns I swore I&apos;d break. Sound familiar?
              </p>
              <p>
                When I discovered the work of Dr. Shefali Tsabary and the framework of conscious parenting,
                something clicked. It wasn&apos;t about managing my kids better - it was about understanding
                myself better. Our children don&apos;t need us to be perfect. They need us to be present,
                honest, and willing to grow.
              </p>
              <p>
                I trained and was personally coached by Dr. Shefali, became certified as a Conscious
                Parenting &amp; Life Coach, and built Who&apos;s Raising Who as the community I wish had
                existed when I was just starting this journey.
              </p>
              <p className="font-medium text-foreground">
                Motherhood is not meant to be walked alone. And the real work - the inner work - is
                the most important work you&apos;ll ever do.
              </p>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-20 bg-secondary/20">
          <div className="container max-w-3xl">
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">Credentials & Training</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Certified Conscious Parenting & Life Coach',
                'Trained and personally coached by Dr. Shefali Tsabary',
                'Specialization in REparenting and breaking generational cycles',
                'Expertise in trigger work, emotional regulation & inner child healing',
                'Group coaching facilitation and community building',
                'Years of work with mothers at every stage of parenting',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl border bg-card">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container max-w-3xl">
            <h2 className="font-serif text-3xl font-bold mb-3 text-center">What I believe</h2>
            <p className="text-muted-foreground text-center mb-10">The principles that guide every session, course, and community conversation.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map(v => (
                <div key={v.title} className="p-6 rounded-2xl border bg-card">
                  <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connect */}
        <section className="py-20 bg-secondary/20">
          <div className="container max-w-xl text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Let&apos;s connect</h2>
            <p className="text-muted-foreground mb-6">
              I love hearing from moms. Whether you have a question, want to share your story,
              or just want to say hi - my inbox is always open.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button asChild>
                <Link href="/book-call">Book a Free Consult Call</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:hello@whosraisingwho.com">hello@whosraisingwho.com</a>
              </Button>
            </div>
            <div className="flex gap-3 justify-center">
              <a href="https://instagram.com/whos_raising_who" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground">
                <Instagram className="h-4 w-4" /> @whos_raising_who
              </a>
              <a href="https://facebook.com/WhosRaisingWhoShira" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
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
