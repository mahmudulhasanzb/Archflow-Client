import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/auth';
import { Check, ArrowRight, Activity, FileText, ShieldCheck, PlusCircle } from 'lucide-react';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) {
    return redirect('/');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent'],
    });
  } catch (err) {
    console.error('Failed to retrieve checkout session:', err);
    return (
      <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#090C15] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#1E2638] rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold font-display text-[#181B20] dark:text-[#F3F4F6]">Session Not Found</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            The payment session ID provided is invalid or has expired. If you completed a payment, your account will update automatically.
          </p>
          <div className="pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { status, customer_details, amount_total, currency, id: transactionId } = session;
  const customerEmail = customer_details?.email;

  if (status === 'open') return redirect('/');

  // Save transaction to DB & Upgrade User to Pro
  if (status === 'complete') {
    try {
      const amount = amount_total ? amount_total / 100 : 14;

      // Log transaction in DB
      await db.collection('transactions').insertOne({
        userEmail: customerEmail || 'unknown',
        amount,
        currency: currency?.toUpperCase() || 'USD',
        transactionId,
        planName: session.line_items?.data?.[0]?.description || 'Archflow Pro Subscription',
        createdAt: new Date(),
      });

      // Update user plan & role
      if (customerEmail) {
        await db.collection('user').updateOne(
          { email: customerEmail.toLowerCase() },
          {
            $set: {
              role: 'pro',
              plan: 'pro',
              updatedAt: new Date(),
            },
          }
        );
      }
    } catch (err) {
      console.error('Failed to save transaction or upgrade user:', err);
    }
  }

  const purchasedItemName = session.line_items?.data?.[0]?.description || 'Archflow Pro Subscription';
  const amountFormatted = amount_total ? (amount_total / 100).toFixed(2) : '14.00';
  const currencyFormatted = currency ? currency.toUpperCase() : 'USD';
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#090C15] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-xl w-full bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#1E2638] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-lg">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground/40" />

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border-2 border-border rounded-full flex items-center justify-center relative bg-muted">
            <Check className="h-8 w-8 text-foreground" />
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-muted text-foreground border border-border mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Stripe Payment Completed
          </span>
          <h1 className="text-foreground font-extrabold text-2xl sm:text-3xl tracking-wide uppercase select-none font-display">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            Welcome to Pro. Your account {customerEmail ? <span className="font-semibold text-foreground">({customerEmail})</span> : ''} is fully upgraded.
          </p>
        </div>

        {/* Receipt Details Card */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8">
          <h3 className="text-foreground text-[11px] font-black uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-foreground" /> Transaction Receipt
          </h3>
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs">Plan Tier</span>
              <span className="text-foreground font-bold text-xs">{purchasedItemName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs">Amount Paid</span>
              <span className="text-foreground font-extrabold text-base">
                ${amountFormatted} {currencyFormatted}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs">Date</span>
              <span className="text-foreground font-medium text-xs">{dateFormatted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs">Transaction ID</span>
              <span className="text-foreground/80 font-mono text-xs max-w-[180px] sm:max-w-none truncate">
                {transactionId}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5">
          <Link
            href="/workspace"
            className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-opacity text-center cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs"
          >
            <Activity className="w-4 h-4" /> Go To Dashboard
          </Link>
          <Link
            href="/add-blueprint"
            className="flex-1 bg-card border border-border hover:bg-muted text-foreground font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors text-center cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-foreground" /> New Blueprint
          </Link>
        </div>
      </div>
    </div>
  );
}
