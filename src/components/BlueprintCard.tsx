'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Layout,
  ShieldAlert,
  Cpu,
  Star,
  ArrowRight,
} from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';

interface Blueprint {
  _id: string;
  title: string;
  shortDescription?: string;
  description: string;
  stack?: string;
  teckStack?: string | string[];
  complexity?: string;
  complexcity?: string;
  rating?: number;
  status: string;
  createdAt?: string;
  Date?: string;
}

interface BlueprintCardProps {
  blueprint: Blueprint;
}

const ICONS = [Cpu, Layers, Layout, ShieldAlert];

function hashIndex(str: string, len: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = (hash * 31 + str.charCodeAt(i)) % len;
  return hash;
}

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

export default function BlueprintCard({ blueprint }: BlueprintCardProps) {
  const id = blueprint._id;
  const title = blueprint.title || 'Untitled Blueprint';
  const description =
    blueprint.shortDescription ||
    blueprint.description ||
    'No description available.';
  const complexity = blueprint.complexity || blueprint.complexcity || 'Medium';
  const rating = blueprint.rating || 4.5;

  let stackItems: string[] = [];
  if (blueprint.teckStack) {
    stackItems = Array.isArray(blueprint.teckStack)
      ? blueprint.teckStack
      : blueprint.teckStack.split(',').map(s => s.trim());
  } else if (blueprint.stack) {
    stackItems = blueprint.stack.split(',').map(s => s.trim());
  }
  if (stackItems.length === 0) stackItems = ['Next.js'];

  const idx = hashIndex(title, ICONS.length);
  const Icon = ICONS[idx];

  return (
    <SpotlightCard className="h-full group">
      {/* Top Header Row with Icon & Complexity */}
      <div className="p-5 pb-0 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 text-foreground transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${getComplexityBadge(
            complexity,
          )}`}
        >
          {complexity}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-base font-bold text-foreground font-display group-hover:text-foreground/80 transition-colors">
            {title}
          </h3>
          <p className="line-clamp-3 text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {stackItems.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {stackItems.length > 3 && (
            <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
              +{stackItems.length - 3}
            </span>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-mono font-bold text-foreground">
              {Number(rating).toFixed(1)}
            </span>
          </div>

          <Link
            href={`/blueprints/${id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline group-hover:translate-x-0.5 transition-transform"
          >
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </SpotlightCard>
  );
}
