'use client';

import React, { useState } from 'react';
import { FileText, Cpu, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: FileText,
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
    title: 'Input Project Concept',
    subtitle: 'Plain Natural Language Prompt',
    description:
      'Describe your application idea, target scale, tech stack preferences, or database requirements in simple plain text.',
    outputTag: 'Natural Text Input',
    details: ['Supports stack preferences (Next.js, Node, Postgres)', 'No rigid config files or manual diagrams required'],
  },
  {
    step: '02',
    icon: Cpu,
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    title: 'Autonomous Swarm Orchestration',
    subtitle: 'Sequential 4-Agent Execution',
    description:
      'Architect, Planner, Documenter, and Reviewer agents run in sync over shared session state to design schemas and review risks.',
    outputTag: 'Real-time JSON & Code Stream',
    details: ['Schema consistency cross-checking', 'Security and rate-limiting audit report'],
  },
  {
    step: '03',
    icon: Download,
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
    title: 'Export & Launch Architecture',
    subtitle: 'Production-Ready Assets',
    description:
      'Download complete MongoDB schemas, OpenAPI definitions, interactive implementation checklists, and server stubs.',
    outputTag: 'Exportable JSON, TS & Markdown',
    details: ['Instant integration into dev workflow', 'Shareable blueprint URLs for team collaboration'],
  },
];

export default function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(1);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-[#E1E4EA] dark:border-[#222C43]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F3] dark:bg-[#0D9488]/15 border border-[#0D9488]/30 px-3.5 py-1 text-xs font-semibold text-[#0D9488] uppercase tracking-wider">
          Architecture Pipeline Workflow
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
          How Archflow Transforms Specs
        </h2>
        <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
          From a simple single-paragraph brief to complete database schemas, task checklists, and security reports in 3 streamlined steps.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Visual Connector Line (Desktop) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-14 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#EA5C34] via-[#4F46E5] to-[#0D9488] opacity-30 z-0"
        />

        {STEPS.map(({ step, icon: Icon, accent, accentSoft, title, subtitle, description, outputTag, details }, index) => {
          const isActive = activeStepIndex === index;
          return (
            <div
              key={step}
              onClick={() => setActiveStepIndex(index)}
              className={`relative z-10 cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-[#0E1321] border-[#4F46E5] shadow-xl scale-[1.02]'
                  : 'bg-white/60 dark:bg-[#0E1321]/60 border-[#E1E4EA] dark:border-[#222C43] hover:border-[#4F46E5]/40'
              }`}
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200"
                    style={{ backgroundColor: accentSoft }}
                  >
                    <Icon className="h-6 w-6" style={{ color: accent }} />
                  </div>
                  <span
                    className="text-3xl font-black font-mono tracking-tight"
                    style={{ color: accent }}
                  >
                    {step}
                  </span>
                </div>

                {/* Subtitle tag */}
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold" style={{ color: accent }}>
                  {subtitle}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {description}
                </p>

                {/* Bullet Highlights */}
                <ul className="space-y-1.5 pt-2 border-t border-[#E1E4EA]/60 dark:border-[#222C43]/60">
                  {details.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Output Tag Footer */}
              <div className="mt-6 pt-4 border-t border-[#E1E4EA]/80 dark:border-[#222C43]/80 flex items-center justify-between text-xs font-mono">
                <span className="text-[#6B7280] dark:text-[#9CA3AF]">Output:</span>
                <span className="px-2.5 py-1 rounded bg-[#F1F3F6] dark:bg-[#171E30] font-semibold text-[#181B20] dark:text-[#F3F4F6]">
                  {outputTag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
