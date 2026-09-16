import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Database, Shield, CheckCircle2, FileCode2, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About - Archflow',
  description: 'Learn about Archflow, the autonomous architecture pipeline delivering production-grade Agentic-IDE specifications for modern developers.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Title & Intro */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Architecture Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-foreground tracking-tight">
            About Archflow
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Archflow is an AI-driven system architecture platform designed to transform software concepts into complete, production-ready specification suites for modern agentic IDEs like Cursor, Windsurf, and Claude Code.
          </p>
        </div>

        {/* Section 1: Our Mission */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-display text-foreground">
            Our Mission
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
            <p>
              Starting modern full-stack software often involves dozens of tedious hours designing schemas, defining REST and WebSocket contracts, tuning indices, structuring folders, and writing task checklists.
            </p>
            <p>
              Archflow was engineered to remove this friction. Instead of prompt-engineering AI models from scratch, Archflow runs a deterministic pipeline to produce an enterprise-grade 5-file specification bundle: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">PROJECT_SPEC.md</code>, <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">ARCHITECTURE.md</code>, <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">DATABASE.md</code>, <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">API_SPEC.md</code>, and <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">TASKS.md</code>.
            </p>
          </div>
        </section>

        {/* Section 2: Core Capabilities */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">
            What We Deliver
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-foreground">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Distributed Topologies</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Clear component boundaries, gateway routing, caching layers, and real-time state synchronization architectures.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-foreground">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Data Schemas & Indices</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Production MongoDB and PostgreSQL document models with compound indices and referential integrity rules.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-foreground">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Stateless Security Contracts</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Better Auth integrations with JWKS public key verification to protect Express and Next.js microservices.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-foreground">
                  <FileCode2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Phased Execution Roadmaps</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Step-by-step checklists categorized by foundation, core APIs, UI views, and verification testing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Core Values */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-display text-foreground">
            Architectural Principles
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-1" />
              <span><strong className="text-foreground">Production Standards:</strong> Every output follows enterprise standards for separation of concerns, strict type-safety, and minimal dependency overhead.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-1" />
              <span><strong className="text-foreground">Vendor Agnostic:</strong> Zero proprietary lock-in. Blueprints export as clean markdown, pure JSON schemas, and universal TypeScript signatures.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-1" />
              <span><strong className="text-foreground">Agentic-First:</strong> Designed specifically for AI pair programmers to read and write without hallucination or context window overflow.</span>
            </li>
          </ul>
        </section>

        {/* Minimal Footer Navigation */}
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Archflow Architecture Platform</span>
          <Link
            href="/blueprints"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline"
          >
            Explore Blueprints
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
