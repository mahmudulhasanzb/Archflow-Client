import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Get logged-in user session from Better Auth
    const userSession = await auth.api.getSession({ headers: headersList });
    const email = userSession?.user?.email;

    // Create Checkout Session matching FitPulse pattern
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Archflow Pro Subscription',
              description: 'Access to AI Multi-Agent Architecture Engine, 10 daily blueprints, and full Markdown suite exports.',
            },
            unit_amount: 1400, // $14.00/month
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create Stripe checkout session' },
      { status: err?.statusCode || 500 }
    );
  }
}
