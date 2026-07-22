import React from 'react';
import { FileCode2, Clock3, CheckCircle2, Bot, Zap } from 'lucide-react';

const STATS = [
  {
    icon: FileCode2,
    value: '14,200+',
    label: 'Blueprints Generated',
    detail: 'Across 40+ tech stacks',
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
  },
  {
    icon: Clock3,
    value: '65,000+',
    label: 'Dev Hours Saved',
    detail: 'Avg 4.5h saved per spec',
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
  },
  {
    icon: CheckCircle2,
    value: '99.9%',
    label: 'Valid Schema Integrity',
    detail: 'Zero syntax errors',
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
  },
  {
    icon: Bot,
    value: '4 Agents',
    label: 'Swarm Execution',
    detail: 'Parallel & sequential loops',
    accent: '#16A34A',
    accentSoft: '#E7F7EC',
  },
];

export default function LiveStats() {
  return (
    <section className="relative border-b border-[#E1E4EA] dark:border-[#222C43] bg-[#FAFBFC] dark:bg-[#090C15] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#4F46E5]/5 via-transparent to-[#0D9488]/5"
      />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F7EC] dark:bg-[#16A34A]/15 border border-[#16A34A]/30 px-3 py-1 text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Live Platform Metrics
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
            Engineered for High-Performance Teams
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label, detail, accent, accentSoft }) => (
            <div
              key={label}
              className="group flex flex-col justify-between rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accentSoft }}
                  >
                    <Icon className="h-6 w-6" style={{ color: accent }} />
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div
                  className="text-4xl font-extrabold font-mono tracking-tight"
                  style={{ color: accent }}
                >
                  {value}
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
                    {label}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    {detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
