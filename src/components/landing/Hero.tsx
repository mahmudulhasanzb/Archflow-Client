'use client';

import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center border-b border-[#E1E4EA] bg-mesh px-4 py-20 text-center overflow-hidden">
      {/* Decorative floating orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#4F46E5]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#0D9488]/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl space-y-8">
        {/* Badge */}
        <div className="animate-slide-up-1 inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] border border-[#4F46E5]/20 px-4 py-1.5 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Driven Architecture
        </div>

        {/* Heading */}
        <h1 className="animate-slide-up-2 text-4xl font-extrabold tracking-tight text-[#181B20] sm:text-6xl font-display leading-tight">
          From Idea to Technical{' '}
          <span className="relative inline-block text-[#4F46E5]">
            Blueprint
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#4F46E5]/30"
            />
          </span>{' '}
          in Seconds
        </h1>

        {/* Sub-description */}
        <p className="animate-slide-up-3 mx-auto max-w-2xl text-base text-[#6B7280] leading-relaxed">
          An AI Software Architect: a team of specialized agents turns your
          one-paragraph project description into schemas, roadmaps, setup
          scripts, and security reviews — instantly.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4F46E5]/25 hover:bg-[#4338CA] hover:shadow-[#4F46E5]/40 transition-all duration-200"
          >
            <Zap className="h-4 w-4" />
            Start Building Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blueprints"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E1E4EA] bg-white/80 px-6 py-3 text-sm font-bold text-[#181B20] hover:bg-[#F1F3F6] hover:border-[#4F46E5]/40 backdrop-blur-sm transition-all duration-200"
          >
            Explore Blueprints
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="animate-fade-in flex flex-wrap items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="flex -space-x-1.5">
              {['#4F46E5', '#0D9488', '#EA5C34', '#16A34A'].map((color, i) => (
                <span
                  key={i}
                  className="h-6 w-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            <span className="font-semibold text-[#181B20]">12,500+</span>
            blueprints generated
          </div>
          <div className="h-4 w-px bg-[#E1E4EA]" />
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-semibold text-[#181B20]">4 AI agents</span>
            working in parallel
          </div>
          <div className="h-4 w-px bg-[#E1E4EA]" />
          <div className="text-xs text-[#6B7280]">
            <span className="font-semibold text-[#181B20]">Free</span> to start
          </div>
        </div>
      </div>
    </section>
  );
}
