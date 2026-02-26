import { Button } from '@/components/ui/button'
import { Instagram, Facebook } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Shira - Who\'s Raising Who',
  description: 'Certified Conscious Parenting & Life Coach, trained and coached by Dr. Shefali Tsabary. Learn about Shira\'s story, approach, and mission.',
}

const values = [
  {
    title: 'Conscious Parenting',
    description: 'Parenting from a place of awareness and intention, not reaction. Understanding why you do what you do — and choosing differently when it no longer serves you.',
  },
  {
    title: 'REparenting',
    description: 'The work isn\'t just about your kids — it\'s about healing the parts of yourself that never got what they needed. As you heal, your parenting transforms.',
  },
  {
    title: 'Breaking Cycles',
    description: 'The patterns we carry — anxiety, control, disconnection — often come from our own upbringing. The cycle ends when we decide to do the inner work.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">

        {/* Story */}
        <section className="py-14 md:py-24 bg-background">
          <div className="container max-w-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-1">Hey Mama,</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">I&apos;m so glad you&apos;re here!</p>
              </div>
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-sage-100 shadow-sm flex-shrink-0">
                <img
                  src="/shira-about.jpg"
                  alt="Shira Finkelstein"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p>
                    I&apos;m Shira — a Certified Conscious Parenting &amp; Life Coach trained and coached
                    by Dr. Shefali Tsabary, and a mom who walks this path every single day.
                  </p>
                  <p>
                    When my son was born, he awakened the soul in me I didn&apos;t know I had. I began to truly
                    understand how deeply the way I care for his emotional needs matters — and in that process,
                    I started to see my own unmet needs that I had never fully acknowledged. That realization set
                    me on a deep personal growth journey through therapy, parenting and personal development work,
                    and ultimately to Dr. Shefali&apos;s Conscious Parenting training.
                  </p>
                  <p>
                    Conscious parenting, to me, isn&apos;t about fixing our children — or ourselves. It&apos;s
                    about understanding our patterns, triggers, and past conditioning so we can show up with
                    more clarity, calm, and intention.
                  </p>
                  <p className="font-medium text-foreground">
                    Our children don&apos;t need perfect parents.<br />
                    They need curious, compassionate, and growing ones.
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
          </div>
        </section>

        {/* Training & Background */}
        <section className="py-14 md:py-20 bg-sage-50/50">
          <div className="container max-w-2xl text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Training &amp; Background</h2>
            <div className="space-y-2 text-muted-foreground leading-relaxed">
              <p className="text-lg font-medium text-foreground">
                Certified Conscious Parenting &amp; Life Coach
              </p>
              <p className="text-lg">
                Trained and coached by Dr. Shefali Tsabary
              </p>
            </div>
            <p className="text-muted-foreground mt-6 max-w-lg mx-auto">
              Years of applied work guiding mothers through triggers, reparenting, and emotional regulation.
            </p>
          </div>
        </section>

        {/* What I Believe */}
        <section className="py-14 md:py-20 bg-background">
          <div className="container max-w-3xl">
            <h2 className="font-serif text-3xl font-bold mb-3 text-center">What I believe</h2>
            <p className="text-muted-foreground text-center mb-12">
              The principles that guide every session and conversation.
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              {values.map(v => (
                <div key={v.title} className="text-center">
                  <h3 className="font-semibold text-lg mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connect */}
        <section className="py-14 md:py-20 bg-sage-50/50">
          <div className="container max-w-xl text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Let&apos;s connect</h2>
            <p className="text-muted-foreground mb-6">
              I love hearing from moms. Whether you have a question, want to share your story,
              or just want to say hi — my inbox is always open.
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
          <Link href="/" className="hover:text-foreground transition-colors">&larr; Back to Home</Link>
          <span className="mx-4">&middot;</span>
          <span>&copy; {new Date().getFullYear()} Shira Finkelstein &middot; Who&apos;s Raising Who</span>
        </div>
      </footer>
    </div>
  )
}
