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
        <div className="pt-4 flex items-center justify-center">
          <div className="relative flex items-center p-1 bg-muted/40 rounded-full border border-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative w-32 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 z-10 ${
                !isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative w-32 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 z-10 ${
                isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              Annual Billing
            </button>
            
            {/* Animated Pill Background */}
            <div
              className={`absolute top-1 bottom-1 w-32 bg-card rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] border border-border/50 transition-transform duration-300 ease-out ${
                isAnnual ? 'translate-x-32' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="ml-4 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch pt-4">
        
        {/* Free Starter Tier */}
        <div className="p-8 rounded-2xl border border-border bg-card flex flex-col justify-between transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-foreground/20">
          <div className="space-y-6">
            <div className="pb-6 border-b border-border/50 space-y-6">
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
            </div>

            <ul className="space-y-3.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-foreground/50 shrink-0" />
                <span>Up to 3 blueprint generations per month</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-foreground/50 shrink-0" />
                <span>Standard 4-agent swarm pipeline</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-foreground/50 shrink-0" />
                <span>MongoDB & Express schema stubs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-foreground/50 shrink-0" />
                <span>Public blueprint gallery access</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="mt-8 block text-center rounded-xl bg-muted border border-border py-3 text-xs font-bold text-foreground hover:bg-muted/80 hover:shadow-sm transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Developer Tier */}
        <div className="relative group">
          {/* Ambient Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/40 to-primary/0 rounded-[1.2rem] blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative h-full p-8 rounded-2xl border border-primary/30 bg-card flex flex-col justify-between transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] hover:border-primary/50">
            
            {/* Top Floating Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-primary text-primary-foreground px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full font-display flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border border-primary-foreground/20">
                <Zap className="h-3.5 w-3.5 fill-current" />
                Most Popular
              </div>
            </div>

            <div className="space-y-6">
              <div className="pb-6 border-b border-border/50 space-y-6 pt-1">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-display">
                    Developer Pro
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    For engineering leads, consultants, and scale-ups.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 font-display">
                    ${isAnnual ? '24' : '29'}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/15 text-primary p-0.5 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 fill-current text-primary-foreground/20" />
                  </div>
                  <span className="font-semibold text-foreground">Unlimited blueprint generations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/15 text-primary p-0.5 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 fill-current text-primary-foreground/20" />
                  </div>
                  <span>Bring your own LLM keys (OpenAI, Claude, Gemini)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/15 text-primary p-0.5 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 fill-current text-primary-foreground/20" />
                  </div>
                  <span>Private & encrypted team blueprints</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/15 text-primary p-0.5 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 fill-current text-primary-foreground/20" />
                  </div>
                  <span>Interactive code stubs & OpenAPI exports</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/15 text-primary p-0.5 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 fill-current text-primary-foreground/20" />
                  </div>
                  <span>Priority multi-agent execution queue</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgradeClick}
              disabled={loadingCheckout}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] border border-primary-foreground/10 hover:brightness-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all cursor-pointer disabled:opacity-60 disabled:hover:brightness-100"
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

      </div>
    </section>
  );
}
