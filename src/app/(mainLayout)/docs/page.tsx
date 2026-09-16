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
  ArrowRight,
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
    summary: 'Executive summary, target personas, non-functional requirements (latency, throughput), core user flows, and tech stack justifications.',
    usage: 'Provides Cursor and Claude Code with the overall product context and guardrails before generating boilerplate.',
  },
  {
    name: 'ARCHITECTURE.md',
    icon: Layers,
    role: 'System Design & Distributed Topology',
    summary: 'Component diagrams, server topologies, caching layers (Redis), state sync strategies (CRDT/WebSockets), and security perimeters.',
    usage: 'Enforces architectural patterns (single-file Express gateway, Next.js App Router, JWKS bridge) across coding agents.',
  },
  {
    name: 'DATABASE.md',
    icon: Database,
    role: 'Schema Models & Indexing Strategy',
    summary: 'Complete collection schemas (MongoDB / PostgreSQL), index definitions, relational joins, and document validation rules.',
    usage: 'Directly consumed by developers or database migration scripts to provision collections and compound indices.',
  },
  {
    name: 'API_SPEC.md',
    icon: Network,
    role: 'REST & WebSocket Interface Contracts',
    summary: 'Endpoint definitions, authorization headers (Bearer JWKS), request body JSON schemas, response status codes, and error formats.',
    usage: 'Prevents interface drift between client fetchers and backend route handlers.',
  },
  {
    name: 'TASKS.md',
    icon: ListChecks,
    role: 'Actionable Implementation Roadmap',
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
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Archflow Architecture Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-foreground">
            The Agentic-IDE Specification Suite
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Archflow generates a deterministic 5-file architecture bundle designed to be directly fed into modern AI coding assistants like Cursor, Windsurf, and Claude Code.
          </p>
        </div>

        {/* The 5 Spec Files Breakdown */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-bold font-display text-foreground">1. The 5 Core Architecture Files</h2>
              <p className="text-sm text-muted-foreground mt-1">
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
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-foreground/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground border border-border">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-mono text-foreground">
                          {spec.name}
                        </h3>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {spec.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {spec.summary}
                  </p>

                  <div className="rounded-xl bg-muted/50 border border-border px-3.5 py-2 text-xs text-muted-foreground">
                    <strong className="text-foreground">IDE Agent Usage: </strong>
                    {spec.usage}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Workflow with Cursor & Claude Code */}
        <section className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold font-display text-foreground">2. Agentic-IDE Prompting Patterns</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Copy-paste these prompt structures directly into your AI coding tool to execute Archflow blueprints seamlessly:
            </p>
          </div>

          <div className="space-y-4">
            {AGENT_IDE_WORKFLOWS.map((wf, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {wf.ide}
                  </span>
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="rounded-xl bg-background p-3 font-mono text-xs text-foreground overflow-x-auto border border-border">
                  <code>{wf.prompt}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Principles */}
        <section className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold font-display text-foreground">3. Architecture Guarantees</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Every system generated by Archflow adheres to established full-stack engineering standards:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                <span>Single-File Express 5 Gateways</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clean, high-performance backends using native MongoDB drivers with connection caching and strict error handling.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                <span>Better Auth & JWKS Security</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stateless cryptographic verification between Next.js frontend and Express backend using RS256/EdDSA key sets.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                <span>Calibrated Design Tokens</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Obsidian dark theme and warm paper light mode with balanced semantic surface, borders, and text contrast.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-foreground" />
                <span>Zero Hallucination Validation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated regex and markdown structure audits ensure all 5 files match schema requirements before database persistence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Ready to generate your first architecture bundle?
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/blueprints"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              Browse Gallery
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

      </div>
    </div>
  );
}

