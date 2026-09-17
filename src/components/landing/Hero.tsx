'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  ChevronRight,
  Code2
} from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background border-b border-border py-16 sm:py-20 md:py-24">
      {/* Vercel-style subtle radial spotlight */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-radial from-foreground/5 via-foreground/[0.02] to-transparent blur-3xl" 
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Centered Header Content with balanced hierarchy */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium text-foreground mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
            <span>Autonomous Architecture Engine v2.0</span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>

          {/* Clean Modern Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12] mb-6">
            Design Production Systems <br className="hidden sm:inline" />
            <span className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Faster Than Prompts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Transform natural language into complete, production-ready system architectures. 
            Generate database schemas, API contracts, deployment specs, and agentic workflows tailored for Cursor, Windsurf, and Claude Code.
          </p>

          {/* Call to Actions with tactile 2.5D depth */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8">
            {/* Primary 2.5D tactile button */}
            <div className="relative group w-full sm:w-auto">
              {/* Subtle ambient border glow */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-primary/50 to-primary/0 opacity-60 group-hover:opacity-100 blur-[1px] transition-opacity duration-300" />
              <Link
                href="/add-blueprint"
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground border border-primary-foreground/20 shadow-[0_4px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-200 active:scale-[0.98]"
              >
                <span>Build A Blueprint</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Secondary 2.5D tactile button */}
            <div className="relative group w-full sm:w-auto">
              {/* Subtle perimeter border gradient */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-foreground/15 to-foreground/0 opacity-60 group-hover:opacity-100 blur-[1px] transition-opacity duration-300" />
              <Link
                href="/blueprints"
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-[0_3px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-muted/60 hover:shadow-[0_6px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 active:scale-[0.98]"
              >
                <Code2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>Explore Blueprints</span>
              </Link>
            </div>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-foreground" /> 5 Spec Markdown Files
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-foreground" /> Cursor & Agentic-IDE Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-foreground" /> Free Tier Included
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
