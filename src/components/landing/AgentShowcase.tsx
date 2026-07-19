import React from 'react';
import { Cpu, Layers, Layout, ShieldAlert } from 'lucide-react';

export default function AgentShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA] bg-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">Specialized Agent Showcase</h2>
        <p className="mt-4 text-[#6B7280]">
          Four custom-configured agents working with unified session context to enforce structural consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-[#E1E4EA] hover:border-[#4F46E5] transition-colors bg-[#FAFBFC]">
          <Cpu className="h-8 w-8 text-[#4F46E5] mb-4" />
          <h3 className="text-base font-bold text-[#181B20] font-display">Architect Agent</h3>
          <p className="mt-2 text-xs text-[#6B7280]">
            Generates schema tables, models, relationships, data validation formats, and indexing queries.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#E1E4EA] hover:border-[#0D9488] transition-colors bg-[#FAFBFC]">
          <Layers className="h-8 w-8 text-[#0D9488] mb-4" />
          <h3 className="text-base font-bold text-[#181B20] font-display">Planner Agent</h3>
          <p className="mt-2 text-xs text-[#6B7280]">
            Builds implementation roadmap check items, milestones, priority scores, and outlines complexity levels.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#E1E4EA] hover:border-[#EA5C34] transition-colors bg-[#FAFBFC]">
          <Layout className="h-8 w-8 text-[#EA5C34] mb-4" />
          <h3 className="text-base font-bold text-[#181B20] font-display">Documenter Agent</h3>
          <p className="mt-2 text-xs text-[#6B7280]">
            Writes installation guides, API reference endpoints, folder outlines, and standard server stub setups.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#E1E4EA] hover:border-[#4F46E5] transition-colors bg-[#FAFBFC]">
          <ShieldAlert className="h-8 w-8 text-[#4F46E5] mb-4" />
          <h3 className="text-base font-bold text-[#181B20] font-display">Reviewer Agent</h3>
          <p className="mt-2 text-xs text-[#6B7280]">
            Verifies schema consistency, estimates performance parameters, runs security compliance checks.
          </p>
        </div>
      </div>
    </section>
  );
}
