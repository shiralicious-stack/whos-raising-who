import { Button } from '@/components/ui/button'
import { CheckCircle2, Instagram, Facebook } from 'lucide-react'
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
        {/* Story */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container max-w-2xl">
            <h2 className="font-serif text-3xl font-bold mb-6">Hey Mama,</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I&apos;m so glad you&apos;re here!
              </p>
              <p>
                I&apos;m Shira — a Certified Conscious Parenting &amp; Life Coach trained and coached
                by Dr. Shefali Tsabary, and a mom who walks this path every single day.
              </p>
              <p>
                I love the beach, travel, deep conversations, and laughing until I can&apos;t breathe —
                and I take my parenting and personal growth just as seriously as I take my joy. I don&apos;t
                believe in perfection. I believe in awareness.
              </p>
              <p>
                Conscious parenting, to me, isn&apos;t about fixing our children — or ourselves. It&apos;s
                about understanding our patterns, triggers, and past conditioning so we can show up with
                more clarity, calm, and intention.
              </p>
              <p className="font-medium text-foreground">
                Our children don&apos;t need perfect parents.<br />
                They need present, self-aware ones.
              </p>
              <p>
                Because the truth is, our healing doesn&apos;t just impact us — it shapes our children&apos;s
                emotional health and the way they experience the world.
              </p>
              <p>
                When we&apos;re unaware of our inner world, we react from it. We project from it. We repeat
                patterns from it. But when we turn inward — with curiosity and compassion — something shifts.
                We gain perspective. We gain freedom. We gain the ability to respond instead of react.
              </p>
              <p className="font-medium text-foreground">
                And that changes everything.
              </p>
              <p>
                It changes how we handle conflict.<br />
                It changes how we repair after we misstep.<br />
                It changes the emotional tone of our homes.
              </p>
              <p>
                Our children learn how to regulate by watching us regulate.<br />
                They learn how to speak to themselves by hearing how we speak to ourselves.<br />
                They learn what love feels like by how we show up in hard moments.
              </p>
              <p className="font-medium text-foreground">
                Breaking cycles with our children doesn&apos;t begin with them.<br />
                It begins with us.
              </p>
              <p>
                I created Who&apos;s Raising Who because while we are raising our children, they are
                raising us too. Our children mirror back the parts of ourselves that still need love and understanding.
                Not to shame us, but to invite us into growth.
              </p>
              <p>
                When we do our inner work, we don&apos;t just change our parenting.<br />
                We change our homes.<br />
                Our relationships.<br />
                The emotional blueprint our children will carry into their own lives.
              </p>
              <p>
                And along the way, we create more peace, more connection, and more joy for ourselves, too.
              </p>
              <p>
                I&apos;m honored to walk alongside you in this work.
              </p>
              <p className="font-medium text-foreground">
                With love,<br />
                Shira
              </p>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-12 md:py-20 bg-secondary/20">
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
        <section className="py-12 md:py-20 bg-background">
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
        <section className="py-12 md:py-20 bg-secondary/20">
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
