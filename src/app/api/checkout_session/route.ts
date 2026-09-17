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

    // Parse request body for billing interval (month vs year)
    const body = await req.json().catch(() => ({}));
    const interval = body?.interval === 'year' ? 'year' : 'month';
    const isYearly = interval === 'year';

    // Pricing: $29/mo (monthly) vs $24/mo billed annually ($288/yr)
    const unitAmount = isYearly ? 28800 : 2900;
    const planName = isYearly ? 'Archflow Pro (Annual)' : 'Archflow Pro (Monthly)';
    const planDescription = isYearly
      ? 'Annual billing ($24/month billed $288/year). Access to AI Architecture Engine, 10 daily blueprints, and private workspaces.'
      : 'Monthly billing ($29/month). Access to AI Architecture Engine, 10 daily blueprints, and private workspaces.';

    // Create Checkout Session matching FitPulse pattern
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: planDescription,
            },
            unit_amount: unitAmount,
            recurring: { interval },
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
