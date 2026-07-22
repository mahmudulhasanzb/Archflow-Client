'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-[#E1E4EA] dark:border-[#222C43]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 border border-[#4F46E5]/30 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
          Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
          Simple, Predictable Plans
        </h2>
        <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">
          Start building for free or unlock unlimited multi-agent generations and custom key integrations.
        </p>

        {/* Annual / Monthly Billing Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold">
          <span className={!isAnnual ? 'text-[#181B20] dark:text-[#F3F4F6]' : 'text-[#6B7280]'}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative h-6 w-11 rounded-full bg-[#4F46E5] p-0.5 transition-colors"
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={isAnnual ? 'text-[#181B20] dark:text-[#F3F4F6]' : 'text-[#6B7280]'}>
            Annual Billing
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Free Starter Tier */}
        <div className="p-8 rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] flex flex-col justify-between space-y-8 shadow-sm hover:shadow-lg transition-all">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
                Free Starter
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                For developers exploring AI software architecture concepts.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#181B20] dark:text-[#F3F4F6] font-display">
                $0
              </span>
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Up to 3 blueprint generations per month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Standard 4-agent swarm pipeline</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>MongoDB & Express schema stubs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Public blueprint gallery access</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="block text-center rounded-xl bg-[#F1F3F6] dark:bg-[#171E30] border border-[#E1E4EA] dark:border-[#222C43] py-3 text-xs font-bold text-[#181B20] dark:text-[#F3F4F6] hover:bg-[#e4e7eb] dark:hover:bg-[#222C43] transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro Developer Tier */}
        <div className="p-8 rounded-2xl border-2 border-[#4F46E5] bg-white dark:bg-[#0E1321] flex flex-col justify-between space-y-8 relative overflow-hidden shadow-2xl glow-indigo-box">
          
          {/* Top Banner */}
          <div className="absolute top-0 right-0 bg-[#4F46E5] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl font-display flex items-center gap-1">
            <Zap className="h-3 w-3 fill-current" />
            Most Popular
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
                Developer Pro
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                For engineering leads, consultants, and scale-ups.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#181B20] dark:text-[#F3F4F6] font-display">
                ${isAnnual ? '24' : '29'}
              </span>
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                <span className="font-semibold text-[#181B20] dark:text-[#F3F4F6]">Unlimited blueprint generations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                <span>Bring your own LLM keys (OpenAI, Claude, Gemini)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                <span>Private & encrypted team blueprints</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                <span>Interactive code stubs & OpenAPI exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                <span>Priority multi-agent execution queue</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#4338CA] transition-colors"
          >
            Upgrade to Pro
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
