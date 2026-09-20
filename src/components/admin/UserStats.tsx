'use client';

import React from 'react';
import { Users, Sparkles, Layers, Ban } from 'lucide-react';
import { UserRouteStats } from '@/lib/api/admin/data';

interface UserStatsProps {
  stats?: UserRouteStats;
  loading?: boolean;
}

export default function UserStats({ stats, loading }: UserStatsProps) {
  const cards = [
    {
      label: 'Free Users',
      value: stats?.freeUsers ?? 0,
      icon: Users,
      iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      glow: 'from-blue-500/5',
      description: 'Standard plan accounts',
    },
    {
      label: 'Paid Users',
      value: stats?.proUsers ?? 0,
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      glow: 'from-amber-500/5',
      description: 'Pro tier subscribers',
    },
    {
      label: 'Blueprints Generated',
      value: stats?.totalBlueprints ?? 0,
      icon: Layers,
      iconColor: 'text-primary bg-primary/10 border-primary/20',
      glow: 'from-primary/5',
      description: 'Total community architectures',
    },
    {
      label: 'Blocked Users',
      value: stats?.blockedUsers ?? 0,
      icon: Ban,
      iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      glow: 'from-rose-500/5',
      description: 'Generation restricted',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.label}
            className="p-5 bg-card rounded-2xl border border-border shadow-xs flex flex-col justify-between gap-3 relative overflow-hidden"
          >
            {/* Subtle ambient gradient per card accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.glow} via-transparent to-transparent pointer-events-none`} />
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.iconColor}`}
              >
                <IconComponent className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="relative">
              <div className="text-2xl font-extrabold text-foreground font-display tabular-nums">
                {loading ? (
                  <span className="inline-block h-7 w-12 bg-muted/60 rounded animate-pulse" />
                ) : (
                  card.value.toLocaleString()
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
