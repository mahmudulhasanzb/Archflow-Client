import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, Layout, ShieldAlert, Star, ArrowRight, Sparkles } from 'lucide-react';
import { getAllBlueprints } from '@/lib/api/server';
import SpotlightCard from '../ui/SpotlightCard';

interface Blueprint {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  stack?: string;
  teckStack?: string | string[];
  complexity?: string;
  complexcity?: string;
  rating?: number;
  status?: string;
}

const STATIC_BLUEPRINTS = [
  {
    _id: '1',
    title: 'Realtime Collaborative Canvas Editor',
    description: 'Multiplayer canvas with Yjs CRDTs, WebSocket relays, and auto-scaling Redis streams.',
    complexity: 'High',
    rating: 4.9,
    icon: Cpu,
    tags: ['Next.js', 'WebSockets', 'Yjs', 'Redis'],
  },
  {
    _id: '2',
    title: 'Microservice API Gateway Pattern',
    description: 'Unified routing portal featuring rate limiting, OAuth token validation, and dynamic load balancing.',
    complexity: 'Medium',
    rating: 4.8,
    icon: Layers,
    tags: ['Node.js', 'Docker', 'Postgres', 'JWT'],
  },
  {
    _id: '3',
    title: 'Serverless SaaS Usage-Based Billing',
    description: 'Stripe webhook sync pipeline with consumption metering database models and automated invoicing.',
    complexity: 'High',
    rating: 4.9,
    icon: Layout,
    tags: ['Stripe', 'MongoDB', 'Express', 'Webhooks'],
  },
];

const getComplexityBadge = (c: string) => {
  const v = (c || 'Medium').toLowerCase();
  if (v === 'high') {
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  }
  if (v === 'medium') {
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }
  return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
};

const ICONS = [Cpu, Layers, Layout, ShieldAlert];

function getStackTags(bp: Blueprint): string[] {
  if (bp.teckStack) {
    return Array.isArray(bp.teckStack)
      ? bp.teckStack
      : bp.teckStack.split(',').map((s) => s.trim());
  }
  if (bp.stack) {
    return bp.stack.split(',').map((s) => s.trim());
  }
  return ['Node.js', 'Next.js'];
}

export default async function FeaturedBlueprints() {
  let displayBlueprints: any[] = STATIC_BLUEPRINTS;
  let isFromApi = false;

  try {
    const res = await getAllBlueprints({ limit: 3, sort: 'newest' });
    const list = res?.blueprints || (Array.isArray(res) ? res : []);
    if (list && list.length > 0) {
      displayBlueprints = list.slice(0, 3);
      isFromApi = true;
    }
  } catch (error) {
    console.error('Failed to load featured blueprints from API:', error);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-border">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3.5 py-1 text-xs font-mono font-medium text-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Community Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
            Featured Blueprints
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Explore latest system architectures engineered by multi-agent pipelines.
          </p>
        </div>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline shrink-0"
        >
          View All Blueprints
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid: 3 Latest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayBlueprints.map((bp, idx) => {
          const Icon = isFromApi ? ICONS[idx % 3] : (STATIC_BLUEPRINTS[idx]?.icon ?? Cpu);
          const tags = isFromApi ? getStackTags(bp) : (STATIC_BLUEPRINTS[idx]?.tags ?? ['Node.js']);
          const ratingValue = bp.rating || 4.8;
          const complexityValue = bp.complexity || bp.complexcity || 'Medium';

          return (
            <SpotlightCard
              key={bp._id || idx}
              className="p-6 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 text-foreground transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getComplexityBadge(
                      complexityValue,
                    )}`}
                  >
                    {complexityValue}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-foreground font-display line-clamp-1 group-hover:text-foreground/80 transition-colors">
                  {bp.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {bp.shortDescription || bp.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tags.slice(0, 4).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-border bg-muted/40 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold font-mono text-foreground">
                    {Number(ratingValue).toFixed(1)}
                  </span>
                </div>
                <Link
                  href={`/blueprints/${bp._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline group-hover:translate-x-0.5 transition-transform"
                >
                  Inspect Blueprint
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
