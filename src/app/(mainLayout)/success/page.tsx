import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { MongoClient } from 'mongodb';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

async function upgradeUserToPro(email: string | undefined | null) {
  if (!email) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) return;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('archflow');
    await db.collection('user').updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          role: 'pro',
          plan: 'pro',
          updatedAt: new Date(),
        },
      }
    );
  } catch (err) {
    console.error('Failed to upgrade user to pro in DB:', err);
  } finally {
    await client.close();
  }
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return redirect('/');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  if (session.status === 'open') {
    return redirect('/');
  }

  if (session.status === 'complete') {
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      await upgradeUserToPro(customerEmail);
    }

    return (
      <section id="success" className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Subscription Active
          </div>
          <h1 className="text-3xl font-extrabold text-[#181B20] dark:text-[#F3F4F6] font-display">
            Welcome to Developer Pro!
          </h1>
        </div>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
          We appreciate your business! Your account {customerEmail ? <strong className="text-[#181B20] dark:text-white">({customerEmail})</strong> : ''} is now upgraded to Pro. You have 10 daily blueprint generations and private visibility enabled.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/add-blueprint"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow hover:bg-indigo-500 transition-colors"
          >
            Create Architecture Blueprint
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E1E4EA] px-5 py-3 text-xs font-bold text-[#181B20] dark:text-[#F3F4F6] hover:bg-slate-50 transition-colors"
          >
            Go to Workspace
          </Link>
        </div>
      </section>
    );
  }

  return redirect('/');
}
