import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, Layout, ShieldAlert, Star, ArrowRight, Sparkles } from 'lucide-react';
import { getAllBlueprints } from '@/lib/api/server';

interface Blueprint {
  _id: string;
  title: string;
  description: string;
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
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    tags: ['Next.js', 'WebSockets', 'Yjs', 'Redis'],
  },
  {
    _id: '2',
    title: 'Microservice API Gateway Pattern',
    description: 'Unified routing portal featuring rate limiting, OAuth token validation, and dynamic load balancing.',
    complexity: 'Medium',
    rating: 4.8,
    icon: Layers,
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
    tags: ['Node.js', 'Docker', 'Postgres', 'JWT'],
  },
  {
    _id: '3',
    title: 'Serverless SaaS Usage-Based Billing',
    description: 'Stripe webhook sync pipeline with consumption metering database models and automated invoicing.',
    complexity: 'High',
    rating: 4.9,
    icon: Layout,
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
    tags: ['Stripe', 'MongoDB', 'Express', 'Webhooks'],
  },
  {
    _id: '4',
    title: 'Distributed Background Job Queue',
    description: 'BullMQ cluster setup using Redis streams for guaranteed job dispatching and retries.',
    complexity: 'Medium',
    rating: 4.7,
    icon: ShieldAlert,
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    tags: ['BullMQ', 'Redis', 'TypeScript', 'Worker'],
  },
];

const complexityBadgeStyle = (complexity: string) => {
  const c = complexity.toLowerCase();
  if (c === 'high') {
    return 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
  }
  if (c === 'medium') {
    return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800';
  }
  return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
};

const ICONS = [Cpu, Layers, Layout, ShieldAlert];
const ACCENTS = ['#4F46E5', '#0D9488', '#EA5C34', '#4F46E5'];
const ACCENT_SOFTS = ['#EEF0FF', '#E6F5F3', '#FFF0EA', '#EEF0FF'];

export default async function FeaturedBlueprints() {
  let displayBlueprints: any[] = STATIC_BLUEPRINTS;
  let isFromApi = false;

  try {
    const apiBlueprints = await getAllBlueprints();
    if (apiBlueprints && apiBlueprints.length > 0) {
      displayBlueprints = apiBlueprints.slice(0, 10);
      isFromApi = true;
    }
  } catch (error) {
    console.error('Failed to load featured blueprints from API:', error);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-[#E1E4EA] dark:border-[#222C43]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EA] dark:bg-[#EA5C34]/15 border border-[#EA5C34]/30 px-3.5 py-1 text-xs font-semibold text-[#EA5C34] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Community Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
            Featured Blueprints
          </h2>
          <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] max-w-xl">
            Explore verified system architectures engineered by multi-agent pipelines.
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline shrink-0"
        >
          View All Blueprints
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBlueprints.map((bp, idx) => {
          const Icon = isFromApi ? ICONS[idx % 4] : (STATIC_BLUEPRINTS[idx]?.icon ?? Cpu);
          const accent = isFromApi ? ACCENTS[idx % 4] : (STATIC_BLUEPRINTS[idx]?.accent ?? '#4F46E5');
          const accentSoft = isFromApi ? ACCENT_SOFTS[idx % 4] : (STATIC_BLUEPRINTS[idx]?.accentSoft ?? '#EEF0FF');
          const tags = isFromApi ? ['Node.js', 'MongoDB'] : (STATIC_BLUEPRINTS[idx]?.tags ?? ['API']);
          const ratingValue = bp.rating || 4.8;
          const complexityValue = bp.complexity || bp.complexcity || 'Medium';

          return (
            <div
              key={bp._id || idx}
              className="group flex flex-col justify-between rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] p-5 shadow-sm hover:shadow-xl hover:border-[#4F46E5]/40 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accentSoft }}
                  >
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${complexityBadgeStyle(complexityValue)}`}
                  >
                    {complexityValue}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#181B20] dark:text-[#F3F4F6] font-display line-clamp-1 group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                  {bp.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed line-clamp-3">
                  {bp.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30] text-[#6B7280] dark:text-[#9CA3AF]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-[#E1E4EA]/80 dark:border-[#222C43]/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="font-bold text-[#181B20] dark:text-[#F3F4F6]">
                    {Number(ratingValue).toFixed(1)}
                  </span>
                </div>
                <Link
                  href={`/blueprints/${bp._id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline"
                >
                  Inspect Blueprint
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
