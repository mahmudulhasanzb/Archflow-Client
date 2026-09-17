import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  FileCode2,
  Layers,
  Palette,
  ListTodo,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

import SpecPreviewTerminal from '@/components/docs/SpecPreviewTerminal';
import PromptCard from '@/components/docs/PromptCard';
import DocsSidebarNav from '@/components/docs/DocsSidebarNav';

export const metadata = {
  title: 'Documentation - Archflow | Agentic IDE Architecture Suite',
  description:
    'Complete technical documentation for Archflow. Learn how Archflow generates deterministic 5-file architecture suites (projectOverview, requirements, architecture, design, executionPlan) for Cursor, Claude Code, Windsurf, and Antigravity.',
};

const ARCH_FILES = [
  {
    name: 'projectOverview.md',
    badge: 'Master Briefing & Setup',
    icon: FileCode2,
    summary:
      'Executive summary, problem solved, target users, full tech stack justifications, port conventions, .env setup, and architectural principles.',
    sections: [
      '1. Executive Summary & Problem Solved',
      '2. Target Users & Value Proposition',
      '3. Tech Stack & Architectural Decisions',
      '4. Repository Quickstart & Environment Setup',
      '5. Core Engineering Principles',
    ],
    agentUsage:
      'Provides AI coding agents with high-level boundary context, repo conventions, and port rules so they do not invent incompatible libraries or clash ports.',
  },
  {
    name: 'requirements.md',
    badge: 'Scope & Acceptance Criteria',
    icon: ListTodo,
    summary:
      'Functional requirements, user personas, non-functional latency/auth constraints, and unambiguous acceptance criteria.',
    sections: [
      '1. Target Personas & User Journeys',
      '2. Core Functional Requirements (with acceptance criteria)',
      '3. Non-Functional Requirements (Security, Latency, Scale)',
      '4. Scope Boundaries (Strictly IN scope vs OUT of scope for MVP)',
      '5. Edge Cases & Validation Rules',
    ],
    agentUsage:
      'Used by coding agents during feature generation to guarantee all acceptance criteria pass before marking any feature as complete.',
  },
  {
    name: 'architecture.md',
    badge: 'System Design & Models',
    icon: Layers,
    summary:
      'Component topology, ASCII directory tree, route map, database schemas with indexes, and REST/WebSocket API contracts.',
    sections: [
      '1. High-Level Architecture & Component Map',
      '2. Detailed Directory & Folder Structure (ASCII tree)',
      '3. Routing Map & URL Structure (Pages, API routes, route guards)',
      '4. Data Models & Entity Schemas (Fields, types, indexes)',
      '5. API Contracts & Endpoint Specifications',
      '6. Engineering Conventions & State Management Rules',
    ],
    agentUsage:
      'The single source of truth for file paths, database schemas, and API payload contracts. Prevents route drift and structural clutter.',
  },
  {
    name: 'design.md',
    badge: 'Design Tokens & UI Hierarchy',
    icon: Palette,
    summary:
      'Visual aesthetic direction, color palette tokens (hex codes), typography scale, component layout rules, and responsive breakpoints.',
    sections: [
      '1. Visual Aesthetic Direction (Theme, contrast, emotional tone)',
      '2. Design Tokens & Color Palette (Hex codes for surfaces, borders, text)',
      '3. Typography & Hierarchy (Font families, weights, scale)',
      '4. Component Hierarchy & Key UI Layouts (Header, cards, tables)',
      '5. Interactive States & Micro-animations (Hover, skeletons, toast)',
      '6. Responsive Breakpoints & Mobile Adaptations',
    ],
    agentUsage:
      'Directs AI front-end generation to build cohesive, high-contrast user interfaces with standardized tokens rather than generic browser defaults.',
  },
  {
    name: 'executionPlan.md',
    badge: 'Agent Task Roadmap',
    icon: CheckCircle2,
    summary:
      'Phased task roadmap designed specifically for Agentic IDEs (Cursor, Antigravity, Claude Code) with actionable checkboxes and verification steps.',
    sections: [
      'Phase 1: Setup & Data Foundation',
      'Phase 2: Core Business Logic & Gateways',
      'Phase 3: Frontend Views & Interactive State',
      'Phase 4: Integration Flows & Error Handling',
      'Phase 5: Verification & Production Smoke Test',
    ],
    agentUsage:
      'Every task uses `- [ ] Task X.Y: ...`, `File: [path]`, and `- Verify: [command]`. Agents execute tasks sequentially without drifting or hallucinating.',
  },
];

const IDE_PROMPTS = [
  {
    ide: 'Cursor (Composer / Agent)',
    description: 'Direct Composer to implement a specific phase using project context and architecture contracts.',
    command:
      '@projectOverview.md @architecture.md @executionPlan.md Read executionPlan.md and implement Phase 1 tasks. Follow schemas in architecture.md strictly. Run verification commands after each task.',
  },
  {
    ide: 'Claude Code CLI',
    description: 'Execute step-by-step tasks through the terminal agent with verified file boundaries.',
    command:
      'claude "Read executionPlan.md and architecture.md. Implement Task 2.1 in Archflow-Server/src/index.ts, verify with the specified curl command, and check off the task."',
  },
  {
    ide: 'Windsurf / Cascade',
    description: 'Autonomous multi-file execution across both client and server directories.',
    command:
      'Execute all unchecked items in executionPlan.md. Ensure all client UI components conform to design.md tokens and backend handlers match architecture.md API contracts.',
  },
  {
    ide: 'Google Antigravity / Agentic Workspace',
    description: 'Pair-programming prompt for complete milestone execution with automated verification.',
    command:
      'Review projectOverview.md and requirements.md. Work through executionPlan.md Phase by Phase. Verify each step with npm run build or the designated test suite.',
  },
];

const NAV_LINKS = [
  { id: 'overview', title: 'Architecture Suite Overview' },
  { id: 'five-files', title: 'The 5 Specification Files' },
  { id: 'interactive-preview', title: 'Interactive Spec Explorer' },
  { id: 'agent-prompts', title: 'Agentic IDE Prompts' },
  { id: 'engineering-standards', title: 'Engineering Standards' },
  { id: 'workflow', title: '3-Step Execution Workflow' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Standard Docs Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Sticky Navigation Sidebar (Desktop) */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                On this page
              </span>
              <Suspense
                fallback={
                  <nav className="space-y-1 text-xs font-medium">
                    {NAV_LINKS.map((link) => (
                      <div
                        key={link.id}
                        className="py-1.5 px-2.5 rounded-xl text-muted-foreground"
                      >
                        {link.title}
                      </div>
                    ))}
                  </nav>
                }
              >
                <DocsSidebarNav navLinks={NAV_LINKS} />
              </Suspense>


            </div>
          </aside>

          {/* Main Docs Content Stream */}
          <main className="flex-1 min-w-0 max-w-4xl space-y-16">
            
            {/* Section 1: Overview */}
            <section id="overview" className="scroll-mt-28 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-foreground" />
                <span>Architecture Suite Overview</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When developers give ambiguous prompts to AI coding assistants, agents routinely hallucinate folder structures, invent mismatched API contracts, and produce fragmented code. Archflow prevents architectural drift by generating an exact, cohesive 5-file specification suite before a single line of code is written.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <span className="text-xs font-bold text-foreground block">Zero Route Drift</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Client fetchers and backend endpoints share exact parameter keys, query names, and JSON status contracts.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <span className="text-xs font-bold text-foreground block">Deterministic Prompts</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every task in the execution plan has a designated file path and automated verification command.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <span className="text-xs font-bold text-foreground block">Agent-First Markdown</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Formatted cleanly in GitHub markdown with ASCII trees and code fences for instant LLM parsing.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: The 5 Core Architecture Files */}
            <section id="five-files" className="scroll-mt-28 space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  The 5 Core Specification Files
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Every blueprint generated by Archflow consists of these five deterministic markdown documents:
                </p>
              </div>

              <div className="space-y-5">
                {ARCH_FILES.map((file) => {
                  const Icon = file.icon;
                  return (
                    <div
                      key={file.name}
                      className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs transition-all hover:border-foreground/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted border border-border text-foreground">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold font-mono text-foreground">
                              {file.name}
                            </h3>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {file.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {file.summary}
                      </p>

                      {/* Internal Sections Breakdown */}
                      <div className="rounded-xl bg-muted/40 border border-border p-3.5 space-y-2">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                          Standard Document Sections
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                          {file.sections.map((sec, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 shrink-0" />
                              <span>{sec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Agent Usage Directive */}
                      <div className="rounded-xl bg-background border border-border px-3.5 py-2.5 text-xs text-muted-foreground flex items-start gap-2">
                        <Terminal className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">AI Agent Usage: </strong>
                          <span>{file.agentUsage}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Interactive Specification Output Explorer */}
            <section id="interactive-preview" className="scroll-mt-28 space-y-4">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Interactive Specification Explorer
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Click through the live tabs below to inspect authentic markdown output generated by Archflow:
                </p>
              </div>
              <SpecPreviewTerminal />
            </section>

            {/* Section 4: Agentic IDE Prompting Patterns */}
            <section id="agent-prompts" className="scroll-mt-28 space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Agentic-IDE Prompting Patterns
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Copy and paste these verified prompt structures into your AI coding tool to execute the suite smoothly:
                </p>
              </div>

              <div className="space-y-4">
                {IDE_PROMPTS.map((item, idx) => (
                  <PromptCard
                    key={idx}
                    ide={item.ide}
                    description={item.description}
                    command={item.command}
                  />
                ))}
              </div>
            </section>

            {/* Section 5: Engineering Standards */}
            <section id="engineering-standards" className="scroll-mt-28 space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Production Engineering Standards
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  All blueprints follow strict, production-tested architecture guidelines:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Single-File Express 5 Gateways</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Clean, high-throughput micro-gateways using the native MongoDB driver with connection caching, ping healthchecks, and structured error handling.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Better Auth & JWKS Verification</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Stateless cryptographic authentication between Next.js frontend and Express backend using JWKS public key rotation.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>Calibrated Contrast Tokens</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Obsidian dark theme and warm paper light mode with balanced semantic surface, border, and text contrast tokens.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Checkbox-Driven Verification</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every task in <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">executionPlan.md</code> specifies an exact command or browser check so agents never complete unverified work.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: 3-Step Execution Workflow */}
            <section id="workflow" className="scroll-mt-28 space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  3-Step Execution Workflow
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  How to take an Archflow blueprint from idea to working software:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Generate & Download</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Input your requirements prompt or choose a community blueprint. Click <strong>Download Suite (.zip)</strong> to get all 5 markdown specifications.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Drop in Repo Root</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Extract the 5 files directly into your project root folder so your AI coding assistant has immediate local workspace context.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Execute with Agent</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Open Cursor Composer or Claude Code CLI and prompt: <em>&quot;Read executionPlan.md and implement Phase 1&quot;</em>.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom CTA Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold font-display text-foreground">
                  Ready to architect your next system?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create a custom architecture suite or browse verified community blueprints.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/blueprints"
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors"
                >
                  Browse Blueprints
                </Link>
                <Link
                  href="/add-blueprint"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-opacity"
                >
                  <span>Build Blueprint</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
}
