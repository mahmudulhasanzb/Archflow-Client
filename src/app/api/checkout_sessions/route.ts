import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const PRICE_ID = 'prod_VFgVb69rUMaIHL';

    // Create Checkout Sessions
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    const isJson = req.headers.get('content-type')?.includes('application/json') || req.headers.get('accept')?.includes('application/json');

    if (!isJson && session.url) {
      return NextResponse.redirect(session.url, 303);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Stripe checkout error' },
      { status: err?.statusCode || 500 }
    );
  }
}
