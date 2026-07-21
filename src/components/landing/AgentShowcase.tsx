import React from 'react';
import { Cpu, Layers, Layout, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const agents = [
  {
    icon: Cpu,
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    borderHover: 'hover:border-[#4F46E5]',
    name: 'Architect Agent',
    role: 'System Design',
    description:
      'Generates schema tables, models, relationships, data validation formats, and indexing queries.',
  },
  {
    icon: Layers,
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
    borderHover: 'hover:border-[#0D9488]',
    name: 'Planner Agent',
    role: 'Roadmap & Milestones',
    description:
      'Builds implementation roadmap check items, milestones, priority scores, and outlines complexity levels.',
  },
  {
    icon: Layout,
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
    borderHover: 'hover:border-[#EA5C34]',
    name: 'Documenter Agent',
    role: 'Docs & API Reference',
    description:
      'Writes installation guides, API reference endpoints, folder outlines, and standard server stub setups.',
  },
  {
    icon: ShieldAlert,
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    borderHover: 'hover:border-[#4F46E5]',
    name: 'Reviewer Agent',
    role: 'Security & QA',
    description:
      'Verifies schema consistency, estimates performance parameters, runs security compliance checks.',
  },
];

export default function AgentShowcase() {
  return (
    <section className="border-b border-[#E1E4EA] bg-[#FAFBFC]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] border border-[#4F46E5]/20 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider mb-4">
            Multi-Agent Pipeline
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">
            Specialized Agent Showcase
          </h2>
          <p className="mt-4 text-[#6B7280] leading-relaxed">
            Four custom-configured agents working with unified session context
            to enforce structural consistency across every blueprint.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map(({ icon: Icon, accent, accentSoft, borderHover, name, role, description }, i) => (
            <div
              key={name}
              className={`card-hover group flex flex-col p-6 rounded-xl border border-[#E1E4EA] bg-white ${borderHover} transition-colors animate-slide-up-${Math.min(i + 1, 4)}`}
            >
              {/* Icon */}
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: accentSoft }}
              >
                <Icon className="h-6 w-6" style={{ color: accent }} />
              </div>

              {/* Role badge */}
              <span
                className="mb-2 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: accent }}
              >
                {role}
              </span>

              {/* Name */}
              <h3 className="text-base font-bold text-[#181B20] font-display mb-2">
                {name}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#6B7280] leading-relaxed flex-1">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/add-blueprint"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] hover:shadow-[#4F46E5]/35 transition-all duration-200"
          >
            Launch the Agent Pipeline
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
