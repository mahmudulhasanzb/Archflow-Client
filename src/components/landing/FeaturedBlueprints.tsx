import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, Layout, ShieldAlert, Star } from 'lucide-react';
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

export default async function FeaturedBlueprints() {
  const staticBlueprintsList = [
    {
      _id: '1',
      title: 'Realtime Collaborative Editor',
      description: 'Multiplayer document editing using Yjs CRDTs and WebSocket relays.',
      complexity: 'High',
      rating: 4.9,
      color: 'bg-[#EEF0FF]',
      icon: Cpu,
      iconColor: 'text-[#4F46E5]',
    },
    {
      _id: '2',
      title: 'Microservice Gateway Pattern',
      description: 'Unified routing portal with rate limiting, auth translation, and load balancing.',
      complexity: 'Medium',
      rating: 4.7,
      color: 'bg-[#E6F5F3]',
      icon: Layers,
      iconColor: 'text-[#0D9488]',
    },
    {
      _id: '3',
      title: 'Serverless SaaS Billing Hub',
      description: 'Stripe-integrated subscription webhook listener and consumption-metering logic.',
      complexity: 'High',
      rating: 4.8,
      color: 'bg-[#FFF0EA]',
      icon: Layout,
      iconColor: 'text-[#EA5C34]',
    },
    {
      _id: '4',
      title: 'Distributed Task Queue',
      description: 'BullMQ background worker cluster using Redis streams for reliable job dispatching.',
      complexity: 'Medium',
      rating: 4.6,
      color: 'bg-[#EEF0FF]',
      icon: ShieldAlert,
      iconColor: 'text-[#4F46E5]',
    },
  ];

  let displayBlueprints: any[] = staticBlueprintsList;
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

  const icons = [Cpu, Layers, Layout, ShieldAlert];
  const bgColors = ['bg-[#EEF0FF]', 'bg-[#E6F5F3]', 'bg-[#FFF0EA]', 'bg-[#EEF0FF]'];
  const iconColors = ['text-[#4F46E5]', 'text-[#0D9488]', 'text-[#EA5C34]', 'text-[#4F46E5]'];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">
          Featured Blueprints
        </h2>
        <p className="mt-4 text-[#6B7280]">
          Browse structural designs created and optimized by the multi-agent
          system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBlueprints.map((bp, idx) => {
          const Icon = isFromApi ? icons[idx % 4] : (staticBlueprintsList[idx]?.icon || Cpu);
          const color = isFromApi ? bgColors[idx % 4] : (staticBlueprintsList[idx]?.color || 'bg-[#EEF0FF]');
          const iconColor = isFromApi ? iconColors[idx % 4] : (staticBlueprintsList[idx]?.iconColor || 'text-[#4F46E5]');
          
          const ratingValue = bp.rating || 4.5;
          const complexityValue = bp.complexity || bp.complexcity || 'Medium';

          return (
            <div
              key={bp._id || idx}
              className="group bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm flex flex-col justify-between h-[360px]"
            >
              <div
                className={`${color} h-40 flex items-center justify-center border-b border-[#E1E4EA]`}
              >
                <Icon className={`h-10 w-10 ${iconColor}`} />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#181B20] font-display line-clamp-1">
                    {bp.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-2 line-clamp-3 leading-relaxed">
                    {bp.description}
                  </p>
                </div>
                <div className="pt-4 flex justify-between items-center text-[10px] text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                    <span className="font-semibold text-slate-800">{Number(ratingValue).toFixed(1)}</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase ${
                    complexityValue.toLowerCase() === 'high' 
                      ? 'text-rose-600 bg-rose-50' 
                      : complexityValue.toLowerCase() === 'medium'
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-emerald-600 bg-emerald-50'
                  }`}>
                    {complexityValue}
                  </span>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href={`/blueprints/${bp._id}`}
                  className="block text-center rounded-lg bg-[#FAFBFC] border border-[#E1E4EA] py-2 text-xs font-semibold text-[#181B20] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
