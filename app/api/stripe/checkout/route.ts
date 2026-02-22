import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Not logged in — redirect to signup first, then checkout
      const body = await request.json()
      const { priceId } = body
      const appUrl = process.env.NEXT_PUBLIC_APP_URL!
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
        allow_promotion_codes: true,
      })
      return NextResponse.json({ url: session.url })
    }

    const { priceId, tierId, courseId, coursePriceId } = await request.json()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    // Get or create Stripe customer
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let customerId = sub?.stripe_customer_id

    if (!customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
    }

    if (courseId && coursePriceId) {
      // One-time course purchase
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: coursePriceId, quantity: 1 }],
        success_url: `${appUrl}/courses?purchased=${courseId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/courses`,
        metadata: { course_id: courseId, user_id: user.id },
      })
      return NextResponse.json({ url: session.url })
    }

    // Subscription checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      subscription_data: {
        metadata: { user_id: user.id, tier_id: tierId },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
