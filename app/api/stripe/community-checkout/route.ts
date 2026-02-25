import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'WRW Spring Cohort 2026',
            },
            unit_amount: 29700,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/community`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[stripe/community-checkout]', message)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
