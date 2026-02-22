import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Body parsing is disabled by default in Next.js App Router route handlers
async function getRawBody(req: Request): Promise<Buffer> {
  const reader = req.body!.getReader()
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const rawBody = await getRawBody(request)
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await handleSubscriptionUpsert(supabase, sub)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'payment' && session.metadata?.course_id) {
          // One-time course purchase completed
          await supabase.from('course_purchases').upsert({
            user_id: session.metadata.user_id,
            course_id: session.metadata.course_id,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_paid: (session.amount_total ?? 0) / 100,
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }
    }
  } catch (err) {
    console.error('[webhook] handler error', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionUpsert(
  supabase: ReturnType<typeof createAdminClient>,
  sub: Stripe.Subscription
) {
  const userId = sub.metadata?.user_id
  const tierId = sub.metadata?.tier_id

  if (!userId || !tierId) {
    console.warn('[webhook] subscription missing user_id or tier_id metadata', sub.id)
    return
  }

  // Get the customer ID
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      tier_id: tierId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      status: sub.status as string,
      interval: sub.items.data[0]?.plan?.interval === 'year' ? 'annual' : 'monthly',
      current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  )
}
