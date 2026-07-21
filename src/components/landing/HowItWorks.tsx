import React from 'react';
import { FileText, Cpu, Download } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: FileText,
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
    title: 'Submit Your Idea',
    description:
      'Input a simple paragraph describing your application needs, stack preferences, and core specifications.',
  },
  {
    step: '02',
    icon: Cpu,
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    title: 'Orchestrate Agents',
    description:
      'Our specialized AI agents sequentially design structures, outline timelines, write code stubs, and review details.',
  },
  {
    step: '03',
    icon: Download,
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
    title: 'Export Blueprint',
    description:
      'Download or view complete database schemas, API specs, interactive task checklists, and security audit reports.',
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-[#E1E4EA]">
      {/* Section header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[#181B20] font-display">
          How It Works
        </h2>
        <p className="mt-4 text-[#6B7280] leading-relaxed">
          Translate your rough ideas into robust, professional development plans
          in three simple steps.
        </p>
      </div>

      {/* Steps grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Connector line (desktop only) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t-2 border-dashed border-[#E1E4EA]"
        />

        {steps.map(({ step, icon: Icon, accent, accentSoft, title, description }, i) => (
          <div
            key={step}
            className={`card-hover relative flex flex-col space-y-4 p-6 bg-white rounded-xl border border-[#E1E4EA] shadow-sm animate-slide-up-${i + 1}`}
          >
            {/* Step number badge */}
            <div className="flex items-center justify-between">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: accentSoft }}
              >
                <Icon className="h-6 w-6" style={{ color: accent }} />
              </div>
              <span
                className="text-4xl font-black font-display opacity-10 select-none"
                style={{ color: accent }}
              >
                {step}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-[#181B20] font-display">
              {title}
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {description}
            </p>

            {/* Bottom accent bar */}
            <div
              className="absolute bottom-0 left-0 h-1 w-0 rounded-b-xl transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: accent }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
