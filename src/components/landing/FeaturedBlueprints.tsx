import React from 'react';
import Link from 'next/link';
import { Cpu, Layers, Layout, ShieldAlert } from 'lucide-react';

export default function FeaturedBlueprints() {
  const blueprintsList = [
    {
      title: 'Realtime Collaborative Editor',
      desc: 'Multiplayer document editing using Yjs CRDTs and WebSocket relays.',
      complexity: 'High Complexity',
      rating: '★ 4.9',
      color: 'bg-[#EEF0FF]',
      icon: Cpu,
      iconColor: 'text-[#4F46E5]'
    },
    {
      title: 'Microservice Gateway Pattern',
      desc: 'Unified routing portal with rate limiting, auth translation, and load balancing.',
      complexity: 'Medium Complexity',
      rating: '★ 4.7',
      color: 'bg-[#E6F5F3]',
      icon: Layers,
      iconColor: 'text-[#0D9488]'
    },
    {
      title: 'Serverless SaaS Billing Hub',
      desc: 'Stripe-integrated subscription webhook listener and consumption-metering logic.',
      complexity: 'High Complexity',
      rating: '★ 4.8',
      color: 'bg-[#FFF0EA]',
      icon: Layout,
      iconColor: 'text-[#EA5C34]'
    },
    {
      title: 'Distributed Task Queue',
      desc: 'BullMQ background worker cluster using Redis streams for reliable job dispatching.',
      complexity: 'Medium Complexity',
      rating: '★ 4.6',
      color: 'bg-[#EEF0FF]',
      icon: ShieldAlert,
      iconColor: 'text-[#4F46E5]'
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">Featured Blueprints</h2>
        <p className="mt-4 text-[#6B7280]">
          Browse structural designs created and optimized by the multi-agent system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blueprintsList.map((bp, idx) => {
          const Icon = bp.icon;
          return (
            <div key={idx} className="group bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm flex flex-col justify-between h-[360px]">
              <div className={`${bp.color} h-40 flex items-center justify-center border-b border-[#E1E4EA]`}>
                <Icon className={`h-10 w-10 ${bp.iconColor}`} />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#181B20] font-display">{bp.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                    {bp.desc}
                  </p>
                </div>
                <div className="pt-4 flex justify-between items-center text-[10px] text-[#6B7280]">
                  <span>Rating: {bp.rating}</span>
                  <span className="font-semibold text-[#0D9488]">{bp.complexity}</span>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href="/explore" className="block text-center rounded-lg bg-[#FAFBFC] border border-[#E1E4EA] py-2 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors">
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
