import React from 'react';
import Link from 'next/link';
import { Layers, Layout, ShieldAlert, Cpu, Star } from 'lucide-react';

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

export default function BlueprintCard({ blueprint }: BlueprintCardProps) {
  // Normalize fields
  const id = blueprint._id || 'mock';
  const title = blueprint.title || 'Untitled Blueprint';
  const description = blueprint.shortDescription || blueprint.description || 'No description available.';
  const complexity = blueprint.complexity || blueprint.complexcity || 'Medium';
  const rating = blueprint.rating || 4.5;

  let stackString = 'Next.js';
  if (blueprint.stack) {
    stackString = blueprint.stack;
  } else if (blueprint.teckStack) {
    if (Array.isArray(blueprint.teckStack)) {
      stackString = blueprint.teckStack.join(' + ');
    } else {
      stackString = blueprint.teckStack;
    }
  }

  // Helper icons
  const getIcon = (stackName: string) => {
    const name = stackName.toLowerCase();
    if (name.includes('express') || name.includes('node')) return Layers;
    if (name.includes('stripe') || name.includes('billing')) return Layout;
    if (name.includes('task') || name.includes('redis')) return ShieldAlert;
    return Cpu;
  };

  const getIconColorClass = (stackName: string) => {
    const name = stackName.toLowerCase();
    if (name.includes('express') || name.includes('node')) return 'text-[#0D9488]';
    if (name.includes('stripe') || name.includes('billing')) return 'text-[#EA5C34]';
    if (name.includes('task') || name.includes('redis')) return 'text-[#4F46E5]';
    return 'text-[#4F46E5]';
  };

  const getBgColorClass = (stackName: string) => {
    const name = stackName.toLowerCase();
    if (name.includes('express') || name.includes('node')) return 'bg-[#E6F5F3]';
    if (name.includes('stripe') || name.includes('billing')) return 'bg-[#FFF0EA]';
    if (name.includes('task') || name.includes('redis')) return 'bg-[#EEF0FF]';
    return 'bg-[#EEF0FF]';
  };

  const Icon = getIcon(stackString);

  return (
    <div className="group bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm flex flex-col justify-between h-[360px] hover:shadow-md hover:border-[#4F46E5]/40 transition-all duration-300">
      {/* Visual Header */}
      <div className={`${getBgColorClass(stackString)} h-40 flex items-center justify-center border-b border-[#E1E4EA] group-hover:opacity-95 transition-opacity`}>
        <Icon className={`h-10 w-10 ${getIconColorClass(stackString)} transform group-hover:scale-110 transition-transform duration-300`} />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-bold text-[#181B20] font-display line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
              {title}
            </h3>
            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600">
              {stackString.split('+')[0].trim()}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-2 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Footer info */}
        <div className="pt-3 flex justify-between items-center text-[10px] text-[#6B7280] border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold text-slate-800">{rating.toFixed(1)}</span>
          </div>
          <span className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase ${
            complexity.toLowerCase() === 'high' 
              ? 'text-rose-600 bg-rose-50' 
              : complexity.toLowerCase() === 'medium'
              ? 'text-amber-600 bg-amber-50'
              : 'text-emerald-600 bg-emerald-50'
          }`}>
            {complexity}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <Link
          href={`/blueprints/${id}`}
          className="block text-center rounded-lg bg-[#FAFBFC] border border-[#E1E4EA] py-2 text-xs font-semibold text-[#181B20] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}