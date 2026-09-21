import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Terminal,
  Workflow,
  ExternalLink,
  Code2,
  Layers,
  Palette,
  ListTodo,
} from 'lucide-react';

export const metadata = {
  title: 'About - Archflow | Autonomous Architecture Engineering',
  description:
    'Learn how Archflow bridges human intent and AI coding assistants like Cursor and Claude Code through deterministic 6-file architecture suites. Built by Mahmudul Hasan.',
};

const STATS = [
  {
    label: 'Deterministic Files',
    value: '6 Specs',
    hint: 'Overview, PRD, Arch, Design, Rules, Plan',
  },

  {
    label: 'Architecture Drift',
    value: '0%',
    hint: 'Unified contracts between client & server',
  },
  {
    label: 'Vendor Lock-in',
    value: 'Zero',
    hint: '100% pure GitHub-flavored markdown',
  },
  {
    label: 'Supported Agents',
    value: 'Universal',
    hint: 'Cursor, Claude Code, Windsurf, Antigravity',
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Natural Language Requirements',
    description:
      'Describe your software concept in plain English. Specify your preferred tech stack (e.g. Next.js, Express, MongoDB) and any explicit scope exclusions.',
    badge: 'Human Input',
  },
  {
    step: '02',
    title: 'Multi-Stage Architect Engine',
    description:
      'Archflow runs a structured LLM pipeline that synthesizes system design, ASCII folder trees, database schemas with indexes, and design tokens.',
    badge: 'LLM Pipeline',
  },
  {
    step: '03',
    title: 'The 6-File Specification Contract',
    description:
      'Generates six cohesive markdown files: projectOverview.md, PRD.md, architecture.md, design.md, rules.md, and executionPlan.md.',
    badge: 'Spec Suite',
  },

  {
    step: '04',
    title: 'Agentic IDE Execution',
    description:
      'Unpack the suite (.zip) into your repository root. Prompt Cursor or Claude Code to execute step-by-step with automated verification commands.',
    badge: 'Deterministic Code',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 border-b border-border pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Architecting for the Agentic AI Era</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-foreground tracking-tight leading-tight">
            Bridging Human Intent & AI Coding Agents
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Archflow is an autonomous architecture engine built to eliminate{' '}
            <strong>architectural drift</strong>. Instead of prompting AI models
            into messy spaghetti code, Archflow generates a deterministic 6-file
            specification contract before a single line of code is written.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs"
              >
                <span className="text-2xl font-extrabold font-display text-foreground block">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-foreground block">
                  {stat.label}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  {stat.hint}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: The Core Problem & The "Why" */}
        <section className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold font-display text-foreground">
              The Problem: Why AI Agents Drift
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI pair programmers are exceptionally powerful, but suffer from
              architectural amnesia without rigid constraints:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span>Without Architecture (Drift & Chaos)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <li>
                  • Agents invent conflicting routes between client fetchers and
                  backend endpoints.
                </li>
                <li>
                  • Database schemas miss critical compound indexes, causing
                  production bottlenecks.
                </li>
                <li>
                  • Clashing port conventions, inconsistent design tokens, and
                  unverified code stubs.
                </li>
                <li>
                  • Developers spend more time debugging agent mistakes than
                  writing real software.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>With Archflow (Deterministic Precision)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <li>
                  • <strong>Exact Folder Trees:</strong> ASCII directory
                  structures define file locations up front.
                </li>
                <li>
                  • <strong>Locked Schemas & Endpoints:</strong> Verified
                  MongoDB models and REST contracts.
                </li>
                <li>
                  • <strong>Design System Tokens:</strong> Pre-calibrated color
                  hex codes, font hierarchy, and responsive rules.
                </li>
                <li>
                  • <strong>Automated Verification:</strong> Every task in
                  executionPlan.md specifies an exact verify check.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: The 4-Stage Autonomous Pipeline */}
        <section className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold font-display text-foreground">
              The 4-Stage Architecture Pipeline
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              How Archflow translates a single-paragraph idea into
              production-grade agentic specifications:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PIPELINE_STEPS.map(item => (
              <div
                key={item.step}
                className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-foreground/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    STAGE {item.step}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted border border-border text-foreground">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: The 5 Specification Documents */}
        <section className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold font-display text-foreground">
              The Output Suite
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Every Archflow generation delivers these six standardized markdown
              files:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 card-hover">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <FileCode2 className="h-4 w-4 shrink-0" />
                <span>projectOverview.md</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Master briefing file with executive summary, stack rationale,
                .env variables, and port rules.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 card-hover">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <ListTodo className="h-4 w-4 shrink-0" />
                <span>PRD.md</span>
              </div>
              <p className="text-xs text-muted-foreground">
                User personas, core functional requirements with Gherkin
                scenarios, scope boundaries, and acceptance criteria.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 card-hover">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <Layers className="h-4 w-4 shrink-0" />
                <span>architecture.md</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Component topology, ASCII folder layout, route maps, MongoDB
                schemas, and API contracts.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 card-hover">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <Palette className="h-4 w-4 shrink-0" />
                <span>design.md</span>
              </div>
              <p className="text-xs text-muted-foreground">
                60-30-10 theme aesthetic, color hex tokens, typography scale,
                component hierarchies, and responsive rules.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 card-hover">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>rules.md</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Strict tech stack conventions, forbidden packages, secrets
                management, and autonomous agent guardrails.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 card-hover">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>executionPlan.md</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Phased task roadmap designed for AI agents with deterministic
                checkboxes (
                <code className="font-mono bg-muted px-1 rounded">- [ ]</code>),
                designated file paths, and automated verification checks.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Creator & Mission */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Engineering & Origin
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                Built by Mahmudul Hasan
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://mahmudulhasan-dev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition-colors"
              >
                <span>Portfolio</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <a
                href="https://github.com/mahmudulhasanzb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Archflow was developed out of a real need when working daily with
            agentic AI IDEs. When pair-programming on complex full-stack web
            applications, having unambiguous architectural contracts before
            coding saves hours of refactoring and prevents prompt exhaustion.
            Archflow turns system design into a deterministic science.
          </p>
        </section>

        {/* CTA Card */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Ready to explore or build your first blueprint?
            </h3>
            <p className="text-xs text-muted-foreground">
              Browse community architectures or generate a complete 6-file
              specification suite.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              Read Docs
            </Link>
            <Link
              href="/workspace/add-blueprint"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-opacity"
            >
              <span>Build Blueprint</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
