import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Verify logged in user session
    const authSession = await auth.api.getSession({
      headers: headersList,
    });

    if (!authSession || !authSession.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in before upgrading to Pro' },
        { status: 401 }
      );
    }

    const user = authSession.user;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Archflow Developer Pro Plan',
              description: 'Unlimited AI agent blueprint generations and custom LLM keys access.',
            },
            unit_amount: 2900, // $29.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        userEmail: user.email,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error('Stripe checkout session error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: err.statusCode || 500 }
    );
  }
}
