'use client';

import React, { useState } from 'react';
import { FileText, Cpu, Download, Check, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: FileText,
    title: 'Input Project Concept',
    subtitle: 'Plain Natural Language Prompt',
    description:
      'Describe your application idea, target scale, tech stack preferences, or database requirements in simple plain text.',
    outputTag: 'Natural Text Input',
    details: [
      'Supports stack preferences (Next.js, Express, MongoDB)',
      'No rigid config files or manual diagrams required',
    ],
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Autonomous Swarm Orchestration',
    subtitle: 'Sequential 4-Agent Execution',
    description:
      'Architect, Planner, Documenter, and Reviewer agents run in sync over shared session state to design schemas and review risks.',
    outputTag: 'Deterministic 5-File Suite',
    details: [
      'Schema consistency cross-checking',
      'Security and rate-limiting audit report',
    ],
  },
  {
    step: '03',
    icon: Download,
    title: 'Export & Launch Architecture',
    subtitle: 'Production-Ready Assets',
    description:
      'Download complete database schemas, OpenAPI contracts, interactive implementation checklists, and server stubs.',
    outputTag: 'Agentic IDE Ready (.zip)',
    details: [
      'Instant integration with Cursor, Windsurf, Claude Code',
      'Shareable blueprint URLs for team collaboration',
    ],
  },
];

export default function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(1);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-border">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3.5 py-1 text-xs font-mono font-medium text-foreground uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
          <span>Architecture Pipeline Workflow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
          How Archflow Transforms Specs
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          From a simple single-paragraph brief to complete database schemas, task checklists, and security reports in 3 streamlined steps.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map(
          (
            { step, icon: Icon, title, subtitle, description, outputTag, details },
            index,
          ) => {
            const isActive = activeStepIndex === index;
            return (
              <div
                key={step}
                onClick={() => setActiveStepIndex(index)}
                className={`relative z-10 cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                  isActive
                    ? 'bg-card border-foreground/50 shadow-lg scale-[1.01] ring-1 ring-foreground/20'
                    : 'bg-card/60 border-border hover:border-foreground/30 hover:bg-card'
                }`}
              >
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 text-foreground transition-transform duration-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-extrabold font-mono tracking-tight text-muted-foreground/50">
                      {step}
                    </span>
                  </div>

                  {/* Subtitle tag */}
                  <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                    {subtitle}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground font-display">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>

                  {/* Checklist details */}
                  <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                    {details.map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Output Pill */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md border border-border bg-muted/50 text-foreground">
                    {outputTag}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Step {step} of 03
                  </span>
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}
