import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, Layout, ShieldAlert, Star, ArrowRight } from 'lucide-react';
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

const STATIC: {
  _id: string;
  title: string;
  description: string;
  complexity: string;
  rating: number;
  icon: typeof Cpu;
  color: string;
  accent: string;
}[] = [
  {
    _id: '1',
    title: 'Realtime Collaborative Editor',
    description: 'Multiplayer document editing using Yjs CRDTs and WebSocket relays.',
    complexity: 'High',
    rating: 4.9,
    icon: Cpu,
    color: '#EEF0FF',
    accent: '#4F46E5',
  },
  {
    _id: '2',
    title: 'Microservice Gateway Pattern',
    description: 'Unified routing portal with rate limiting, auth translation, and load balancing.',
    complexity: 'Medium',
    rating: 4.7,
    icon: Layers,
    color: '#E6F5F3',
    accent: '#0D9488',
  },
  {
    _id: '3',
    title: 'Serverless SaaS Billing Hub',
    description: 'Stripe-integrated subscription webhook listener and consumption-metering logic.',
    complexity: 'High',
    rating: 4.8,
    icon: Layout,
    color: '#FFF0EA',
    accent: '#EA5C34',
  },
  {
    _id: '4',
    title: 'Distributed Task Queue',
    description: 'BullMQ background worker cluster using Redis streams for reliable job dispatching.',
    complexity: 'Medium',
    rating: 4.6,
    icon: ShieldAlert,
    color: '#EEF0FF',
    accent: '#4F46E5',
  },
];

const complexityStyle = (c: string) => {
  const v = c.toLowerCase();
  if (v === 'high') return 'text-rose-600 bg-rose-50';
  if (v === 'medium') return 'text-amber-600 bg-amber-50';
  return 'text-emerald-600 bg-emerald-50';
};

const API_ICONS = [Cpu, Layers, Layout, ShieldAlert];
const API_COLORS = ['#EEF0FF', '#E6F5F3', '#FFF0EA', '#EEF0FF'];
const API_ACCENTS = ['#4F46E5', '#0D9488', '#EA5C34', '#4F46E5'];

export default async function FeaturedBlueprints() {
  let displayBlueprints: any[] = STATIC;
  let isFromApi = false;

  try {
    const apiBlueprints = await getAllBlueprints();
    if (apiBlueprints && apiBlueprints.length > 0) {
      displayBlueprints = apiBlueprints.slice(0, 4);
      isFromApi = true;
    }
  } catch (error) {
    console.error('Failed to load featured blueprints from API, falling back to static:', error);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA]">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#EA5C34] mb-2">
            From the Community
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">
            Featured Blueprints
          </h2>
          <p className="mt-3 text-[#6B7280] leading-relaxed max-w-xl">
            Browse structural designs created and optimized by the multi-agent system.
          </p>
        </div>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:underline shrink-0"
        >
          View All Blueprints <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBlueprints.map((bp, idx) => {
          const Icon = isFromApi ? API_ICONS[idx % 4] : (STATIC[idx]?.icon ?? Cpu);
          const color = isFromApi ? API_COLORS[idx % 4] : (STATIC[idx]?.color ?? '#EEF0FF');
          const accent = isFromApi ? API_ACCENTS[idx % 4] : (STATIC[idx]?.accent ?? '#4F46E5');
          const ratingValue = bp.rating || 4.5;
          const complexityValue = bp.complexity || bp.complexcity || 'Medium';

          return (
            <div
              key={bp._id || idx}
              className="card-hover group flex flex-col overflow-hidden rounded-xl border border-[#E1E4EA] bg-white shadow-sm hover:border-[#4F46E5]/30"
            >
              {/* Gradient header */}
              <div
                className="relative flex h-36 items-center justify-center border-b border-[#E1E4EA] transition-opacity duration-200 group-hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${color} 0%, white 100%)` }}
              >
                <Icon
                  className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: accent }}
                />
                <span
                  className={`absolute top-3 right-3 rounded px-2 py-0.5 text-[9px] font-bold uppercase ${complexityStyle(complexityValue)}`}
                >
                  {complexityValue}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-1 text-sm font-bold text-[#181B20] font-display transition-colors duration-200 group-hover:text-[#4F46E5]">
                  {bp.title}
                </h3>
                <p className="line-clamp-3 text-xs text-[#6B7280] leading-relaxed flex-1">
                  {bp.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#E1E4EA] pt-3 text-[10px] text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                    <span className="font-semibold text-[#181B20]">
                      {Number(ratingValue).toFixed(1)}
                    </span>
                  </div>
                  <Link
                    href={`/blueprints/${bp._id}`}
                    className="flex items-center gap-0.5 font-semibold text-[#4F46E5] hover:underline"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
