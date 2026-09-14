import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileCode2,
  Layers,
  Database,
  Network,
  ListChecks,
  Terminal,
  Sparkles,
  ArrowRight,
  Copy,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Documentation - Archflow',
  description: 'Learn how Archflow generates production-ready Agentic-IDE architectures (PROJECT_SPEC, ARCHITECTURE, DATABASE, API_SPEC, TASKS) for modern AI engineers.',
};

const SPEC_FILES = [
  {
    name: 'PROJECT_SPEC.md',
    icon: FileCode2,
    role: 'Product Scope & Requirements',
    color: '#4F46E5',
    summary: 'Executive summary, target personas, non-functional requirements (latency, throughput), core user flows, and tech stack justifications.',
    usage: 'Provides Cursor and Claude Code with the overall product context and guardrails before generating boilerplate.',
  },
  {
    name: 'ARCHITECTURE.md',
    icon: Layers,
    role: 'System Design & Distributed Topology',
    color: '#0D9488',
    summary: 'Component diagrams, server topologies, caching layers (Redis), state sync strategies (CRDT/WebSockets), and security perimeters.',
    usage: 'Enforces architectural patterns (single-file Express gateway, Next.js App Router, JWKS bridge) across coding agents.',
  },
  {
    name: 'DATABASE.md',
    icon: Database,
    role: 'Schema Models & Indexing Strategy',
    color: '#6366F1',
    summary: 'Complete collection schemas (MongoDB / PostgreSQL), index definitions, relational joins, and document validation rules.',
    usage: 'Directly consumed by developers or database migration scripts to provision collections and compound indices.',
  },
  {
    name: 'API_SPEC.md',
    icon: Network,
    role: 'REST & WebSocket Interface Contracts',
    color: '#EC4899',
    summary: 'Endpoint definitions, authorization headers (Bearer JWKS), request body JSON schemas, response status codes, and error formats.',
    usage: 'Prevents interface drift between client fetchers and backend route handlers.',
  },
  {
    name: 'TASKS.md',
    icon: ListChecks,
    role: 'Actionable Implementation Roadmap',
    color: '#10B981',
    summary: 'Phased checklist split into atomic tasks. Covers infrastructure provisioning, schema models, API routes, frontend views, and verification.',
    usage: 'Can be executed step-by-step by developer agents (Windsurf cascade, Claude Code, Cursor Composer).',
  },
];

const AGENT_IDE_WORKFLOWS = [
  {
    ide: 'Cursor (Composer / Agent)',
    prompt: '@PROJECT_SPEC.md @ARCHITECTURE.md @TASKS.md Implement Phase 1: setup Express gateway and MongoDB collections according to DATABASE.md',
  },
  {
    ide: 'Claude Code CLI',
    prompt: 'claude "Read TASKS.md and implement Task 2.1 in Archflow-Server/src/index.ts conforming to API_SPEC.md"',
  },
  {
    ide: 'Windsurf / Cascade',
    prompt: 'Execute all unchecked tasks in TASKS.md following schemas in DATABASE.md and contracts in API_SPEC.md',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#090C15] text-[#181B20] dark:text-[#F3F4F6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/30 bg-[#EEF0FF] dark:bg-[#4F46E5]/15 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Archflow Architecture Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display">
            The Agentic-IDE Specification Suite
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
            Archflow generates a deterministic 5-file architecture bundle designed to be directly fed into modern AI coding assistants like Cursor, Windsurf, and Claude Code.
          </p>
        </div>

        {/* The 5 Spec Files Breakdown */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E1E4EA] dark:border-[#222C43] pb-4">
            <div>
              <h2 className="text-2xl font-bold font-display">1. The 5 Core Architecture Files</h2>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                Every generated blueprint contains this complete, production-grade specification contract:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {SPEC_FILES.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.name}
                  className="rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] p-6 shadow-sm transition-all hover:border-[#4F46E5]/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${spec.color}15` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: spec.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-mono text-[#181B20] dark:text-[#F3F4F6]">
                          {spec.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8]">
                          {spec.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-3">
                    {spec.summary}
                  </p>

                  <div className="rounded-lg bg-[#FAFBFC] dark:bg-[#0A0D17] border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    <strong className="text-[#181B20] dark:text-gray-300">IDE Agent Usage: </strong>
                    {spec.usage}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Workflow with Cursor & Claude Code */}
        <section className="space-y-6">
          <div className="border-b border-[#E1E4EA] dark:border-[#222C43] pb-4">
            <h2 className="text-2xl font-bold font-display">2. Agentic-IDE Prompting Patterns</h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              Copy-paste these prompt structures directly into your AI coding tool to execute Archflow blueprints seamlessly:
            </p>
          </div>

          <div className="space-y-4">
            {AGENT_IDE_WORKFLOWS.map((wf, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">
                    {wf.ide}
                  </span>
                  <Terminal className="h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                </div>
                <div className="rounded-lg bg-[#090C15] p-3 font-mono text-xs text-[#A7F3D0] overflow-x-auto border border-[#222C43]">
                  <code>{wf.prompt}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Principles */}
        <section className="space-y-6">
          <div className="border-b border-[#E1E4EA] dark:border-[#222C43] pb-4">
            <h2 className="text-2xl font-bold font-display">3. Architecture Guarantees</h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              Every system generated by Archflow adheres to established full-stack engineering standards:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#181B20] dark:text-[#F3F4F6]">
                <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                <span>Single-File Express 5 Gateways</span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Clean, high-performance backends using native MongoDB drivers with connection caching and strict error handling.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#181B20] dark:text-[#F3F4F6]">
                <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                <span>Better Auth & JWKS Security</span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Stateless cryptographic verification between Next.js frontend and Express backend using RS256/EdDSA key sets.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#181B20] dark:text-[#F3F4F6]">
                <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                <span>60-30-10 Visual Design Tokens</span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                60% dominant neutral canvas, 30% structural cards/surfaces, and 10% electric indigo/teal accents with native dark mode support.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#181B20] dark:text-[#F3F4F6]">
                <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                <span>Zero Hallucination Validation</span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                Automated regex and markdown structure audits ensure all 5 files match schema requirements before database persistence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="pt-8 border-t border-[#E1E4EA] dark:border-[#222C43] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Ready to generate your first architecture bundle?
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/blueprints"
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] text-[#181B20] dark:text-[#F3F4F6] hover:bg-[#F1F3F6] dark:hover:bg-[#171E30]"
            >
              Browse Gallery
            </Link>
            <Link
              href="/add-blueprint"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm"
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
