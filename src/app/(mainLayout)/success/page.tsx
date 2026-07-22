import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { MongoClient } from 'mongodb';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

async function upgradeUserRoleInDb(userId: string | undefined, userEmail: string | undefined) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing during payment role upgrade');
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('archflow');
    const userCollection = db.collection('user');

    const filterOrs: any[] = [];
    if (userId) filterOrs.push({ _id: userId });
    if (userEmail) filterOrs.push({ email: userEmail });

    if (filterOrs.length > 0) {
      const updateResult = await userCollection.updateOne(
        { $or: filterOrs },
        {
          $set: {
            role: 'pro',
            plan: 'pro',
            updatedAt: new Date(),
          },
        }
      );
      console.log(`Upgraded user role to 'pro'. Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);
    }
  } catch (err) {
    console.error('Failed to update user role in MongoDB:', err);
  } finally {
    await client.close();
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return redirect('/');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });
  } catch (err) {
    console.error('Error retrieving Stripe checkout session:', err);
    return redirect('/');
  }

  if (session.status === 'open') {
    return redirect('/');
  }

  const isPaid = session.payment_status === 'paid' || session.status === 'complete';

  if (isPaid) {
    const userId = session.client_reference_id || (session.metadata?.userId as string);
    const customerEmail = session.customer_details?.email || (session.metadata?.userEmail as string);

    // Upgrade ONLY the authenticated user who completed payment
    await upgradeUserRoleInDb(userId, customerEmail);

    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 flex-grow">
        <div className="p-8 sm:p-12 rounded-3xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          {/* Top Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl"
          />

          {/* Success Animated Badge */}
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto border border-emerald-500/20 shadow-lg">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Payment Successful
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#181B20] dark:text-[#F3F4F6] font-display">
              Welcome to Developer Pro!
            </h1>
          </div>

          {/* Details */}
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed max-w-lg mx-auto">
            Your account <span className="font-bold text-[#181B20] dark:text-[#F3F4F6]">{customerEmail}</span> has been upgraded to <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">Pro Role</span>. You now have unlimited access to multi-agent blueprint generations and custom LLM keys.
          </p>

          {/* Features Granted List */}
          <div className="p-5 rounded-2xl bg-[#FAFBFC] dark:bg-[#090C15] border border-[#E1E4EA] dark:border-[#222C43] text-xs space-y-2.5 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 text-[#181B20] dark:text-[#F3F4F6] font-bold">
              <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
              Pro Privileges Activated:
            </div>
            <ul className="space-y-1.5 text-[#6B7280] dark:text-[#9CA3AF] pl-6 list-disc">
              <li>User Role updated to <strong className="text-emerald-600 dark:text-emerald-400">Pro</strong></li>
              <li>Unlimited AI agent blueprint generations</li>
              <li>Priority execution queue</li>
              <li>Custom LLM API key credentials enabled</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/add-blueprint"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#4338CA] transition-colors"
            >
              Generate New Blueprint
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] px-6 py-3.5 text-xs font-bold text-[#181B20] dark:text-[#F3F4F6] hover:bg-[#F1F3F6] dark:hover:bg-[#171E30] transition-colors"
            >
              Go to Workspace
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return redirect('/');
}
