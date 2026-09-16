'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { CheckCircle2, Sparkles, ArrowRight, Zap, Loader2, ShieldCheck } from 'lucide-react';

import toast from 'react-hot-toast';

export default function Pricing() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const userRole = (session?.user as any)?.role?.toLowerCase();
  const isProUser = userRole === 'pro' || userRole === 'admin';

  const handleUpgradeClick = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    setLoadingCheckout(true);
    const toastId = toast.loading('Initiating secure Stripe payment...');

    try {
      const res = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.url) {
        toast.success('Redirecting to Stripe...', { id: toastId });
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to initiate checkout', { id: toastId });
        setLoadingCheckout(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('An error occurred. Please try again.', { id: toastId });
      setLoadingCheckout(false);
    }
  };

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-border">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border px-3.5 py-1 text-xs font-mono font-medium text-foreground uppercase tracking-wider">
          Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
          Simple, Predictable Plans
        </h2>
        <p className="text-base text-muted-foreground">
          Start building for free or unlock unlimited multi-agent generations and custom key integrations.
        </p>

        {/* Annual / Monthly Billing Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold">
          <span className={!isAnnual ? 'text-foreground' : 'text-muted-foreground'}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative h-6 w-11 rounded-full bg-foreground p-0.5 transition-colors cursor-pointer"
          >
            <span
              className={`block h-5 w-5 rounded-full bg-background transition-transform ${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={isAnnual ? 'text-foreground' : 'text-muted-foreground'}>
            Annual Billing
          </span>
          <span className="text-[10px] font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Free Starter Tier */}
        <div className="p-8 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-8 shadow-sm hover:border-foreground/30 transition-all">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground font-display">
                Free Starter
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                For developers exploring AI software architecture concepts.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground font-display">
                $0
              </span>
              <span className="text-xs text-muted-foreground">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Up to 3 blueprint generations per month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Standard 4-agent swarm pipeline</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>MongoDB & Express schema stubs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Public blueprint gallery access</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="block text-center rounded-xl bg-muted border border-border py-3 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Developer Tier */}
        <div className="p-8 rounded-2xl border-2 border-foreground bg-card flex flex-col justify-between space-y-8 relative overflow-hidden shadow-2xl">
          
          {/* Top Banner */}
          <div className="absolute top-0 right-0 bg-foreground text-background px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl font-display flex items-center gap-1">
            <Zap className="h-3 w-3 fill-current" />
            Most Popular
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground font-display">
                Developer Pro
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                For engineering leads, consultants, and scale-ups.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground font-display">
                ${isAnnual ? '24' : '29'}
              </span>
              <span className="text-xs text-muted-foreground">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span className="font-semibold text-foreground">Unlimited blueprint generations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Bring your own LLM keys (OpenAI, Claude, Gemini)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Private & encrypted team blueprints</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Interactive code stubs & OpenAPI exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                <span>Priority multi-agent execution queue</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgradeClick}
            disabled={loadingCheckout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {loadingCheckout ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : isProUser ? (
              <>
                <ShieldCheck className="h-4 w-4 text-foreground" />
                Active Pro Plan (Go to App)
              </>
            ) : (
              <>
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
