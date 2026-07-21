import React from 'react';
import Link from 'next/link';
import { Layers, Layout, ShieldAlert, Cpu, Star, ArrowRight } from 'lucide-react';

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
const ACCENTS = [
  { color: '#4F46E5', soft: '#EEF0FF' },
  { color: '#0D9488', soft: '#E6F5F3' },
  { color: '#EA5C34', soft: '#FFF0EA' },
  { color: '#4F46E5', soft: '#EEF0FF' },
];

function hashIndex(str: string, len: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % len;
  return hash;
}

const complexityStyle = (c: string) => {
  const v = c.toLowerCase();
  if (v === 'high') return 'text-rose-600 bg-rose-50';
  if (v === 'medium') return 'text-amber-600 bg-amber-50';
  return 'text-emerald-600 bg-emerald-50';
};

export default function BlueprintCard({ blueprint }: BlueprintCardProps) {
  const id = blueprint._id || 'mock';
  const title = blueprint.title || 'Untitled Blueprint';
  const description =
    blueprint.shortDescription || blueprint.description || 'No description available.';
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
  const { color, soft } = ACCENTS[idx];

  return (
    <div className="card-hover group flex flex-col overflow-hidden rounded-xl border border-[#E1E4EA] bg-white shadow-sm hover:border-[#4F46E5]/30">
      {/* Gradient header area */}
      <div
        className="relative flex h-36 items-center justify-center border-b border-[#E1E4EA] transition-opacity duration-200 group-hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${soft} 0%, white 100%)` }}
      >
        <Icon
          className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
          style={{ color }}
        />
        {/* Complexity badge top-right */}
        <span
          className={`absolute top-3 right-3 rounded px-2 py-0.5 text-[9px] font-bold uppercase ${complexityStyle(complexity)}`}
        >
          {complexity}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-[#181B20] font-display transition-colors duration-200 group-hover:text-[#4F46E5]">
          {title}
        </h3>
        <p className="line-clamp-3 text-xs text-[#6B7280] leading-relaxed">
          {description}
        </p>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {stackItems.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-full bg-[#F1F3F6] px-2 py-0.5 text-[9px] font-semibold text-[#6B7280]"
            >
              {tag}
            </span>
          ))}
          {stackItems.length > 3 && (
            <span className="rounded-full bg-[#F1F3F6] px-2 py-0.5 text-[9px] font-semibold text-[#6B7280]">
              +{stackItems.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E1E4EA] pt-3 text-[10px] text-[#6B7280]">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold text-[#181B20]">{Number(rating).toFixed(1)}</span>
          </div>
          <Link
            href={`/blueprints/${id}`}
            className="flex items-center gap-0.5 font-semibold text-[#4F46E5] hover:underline"
          >
            View <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}