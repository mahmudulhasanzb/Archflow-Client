'use client';

import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Wand2,
  Download,
  ArrowRight,
  Check,
  Code,
  Layers,
  Database,
  ListTodo,
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Describe Your App Idea',
      description:
        'Write what you want to build in everyday language. Mention your preferred tech stack or let Archflow choose the best tools for you.',
      preview: (
        <div className="rounded-xl border border-border bg-card/90 p-3.5 text-xs text-muted-foreground font-mono leading-relaxed">
          <span className="text-foreground font-semibold">&ldquo;</span>Build a modern project management tool with kanban boards, Stripe subscriptions, and team workspaces.<span className="text-foreground font-semibold">&rdquo;</span>
        </div>
      ),
      badge: 'Plain English',
    },
    {
      number: '02',
      icon: Wand2,
      title: 'Archflow Designs the System',
      description:
        'In 15 seconds, Archflow crafts your database models, API endpoint contracts, security rules, and phased checklists.',
      preview: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground">
            <Database className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-medium">Database Schemas & Indices</span>
            <Check className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground">
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-medium">REST API Endpoints & Auth</span>
            <Check className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground">
            <ListTodo className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium">Step-by-Step Task Checklist</span>
            <Check className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
          </div>
        </div>
      ),
      badge: 'Takes 15 Seconds',
    },
    {
      number: '03',
      icon: Download,
      title: 'Download & Build in Your IDE',
      description:
        'Export your blueprint as a .zip package. Open it in Cursor, Windsurf, or VS Code and start building with your AI coding assistant.',
      preview: (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <Download className="h-3.5 w-3.5 text-foreground" />
              <span className="font-semibold text-foreground">blueprint-suite.zip</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">5 Files</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
            <Code className="h-3 w-3" />
            <span>Ready for Cursor, Claude Code & VS Code</span>
          </div>
        </div>
      ),
      badge: '1-Click Export',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-border">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3.5 py-1 text-xs font-mono font-medium text-foreground uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
          From Idea to Architecture in Seconds
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          No complex diagrams or manual documentation. Just write what you want to build, and Archflow designs the full software architecture for you.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-foreground/20"
            >
              <div className="space-y-4">
                {/* Step number and Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase border border-border">
                      {step.badge}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-muted-foreground/60">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground font-display">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual Preview Box */}
                <div className="pt-2">{step.preview}</div>
              </div>

              {/* Step indicator footer */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Step {index + 1} of 3</span>
                {index < 2 ? (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    Next step <ArrowRight className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-emerald-500">
                    Ready to build <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
