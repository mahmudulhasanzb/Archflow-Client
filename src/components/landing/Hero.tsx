'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  FileCode2, 
  Database, 
  Network, 
  ListChecks, 
  Layers, 
  Check, 
  Copy,
  ChevronRight,
  Code2
} from 'lucide-react';

const BLUEPRINT_PREVIEWS = {
  project: {
    name: 'PROJECT_SPEC.md',
    icon: FileCode2,
    badge: 'Overview & Goals',
    content: `# Realtime Collaborative Canvas
## System Overview
High-performance distributed canvas engine supporting 50+ concurrent editors.
- **Latency Target**: < 15ms local optimistic updates
- **State Sync**: Yjs CRDT over distributed WebSockets
- **Storage**: Append-only event log with S3 snapshot backups
- **Auth**: Better Auth session tokens with JWKS validation`,
  },
  architecture: {
    name: 'ARCHITECTURE.md',
    icon: Layers,
    badge: 'System Design',
    content: `## Distributed Topology
┌─────────────┐      ┌─────────────────────────┐
│ Next.js App │ <──> │ Express Gateway (P-5000)│
└─────────────┘      └────────────┬────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       ┌────────────────────┐          ┌───────────────────┐
       │ Redis CRDT Cluster │          │ MongoDB Replica   │
       └────────────────────┘          └───────────────────┘`,
  },
  database: {
    name: 'DATABASE.md',
    icon: Database,
    badge: 'Data Models',
    content: `## MongoDB Collections

### documents
{
  "_id": ObjectId("..."),
  "title": "Q3 Infrastructure Map",
  "ownerId": "usr_99812",
  "crdtState": BinData(0, "..."),
  "version": 42,
  "updatedAt": ISODate("2026-09-14T10:00:00Z")
}
// Indices: { ownerId: 1, updatedAt: -1 }`,
  },
  api: {
    name: 'API_SPEC.md',
    icon: Network,
    badge: 'Endpoints & RPC',
    content: `## REST & WebSocket Contracts

### POST /api/canvas/session
Headers: Authorization: Bearer <jwks_token>
Response 200 OK:
{
  "sessionId": "ses_81729",
  "wsEndpoint": "wss://engine.archflow.dev/ws/canvas",
  "readOnly": false
}`,
  },
  tasks: {
    name: 'TASKS.md',
    icon: ListChecks,
    badge: 'Roadmap & Sprints',
    content: `## Agentic Execution Plan
- [x] Phase 1: Redis Pub/Sub sync layer configuration
- [x] Phase 2: Schema validation & JWT authorization bridge
- [ ] Phase 3: Optimistic CRDT client rendering in Next.js
- [ ] Phase 4: S3 vector snapshot archival cron`,
  },
};

type PreviewKey = keyof typeof BLUEPRINT_PREVIEWS;

export default function Hero() {
  const [activeTab, setActiveTab] = useState<PreviewKey>('project');
  const [copied, setCopied] = useState(false);

  const activeSpec = BLUEPRINT_PREVIEWS[activeTab];
  const ActiveIcon = activeSpec.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSpec.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAFBFC] dark:bg-[#090C15] border-b border-[#E1E4EA] dark:border-[#222C43] pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Subtle background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-gradient-to-tr from-[#4F46E5]/12 via-[#0D9488]/10 to-transparent blur-3xl" 
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Centered Header Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/30 bg-[#EEF0FF] dark:bg-[#4F46E5]/15 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8]">
            <Sparkles className="h-3.5 w-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
            <span>Autonomous Architecture Engine v2.0</span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>

          {/* Clean Modern Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#181B20] dark:text-[#F3F4F6] leading-[1.12]">
            Design Production Systems <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#0D9488] bg-clip-text text-transparent">
              Faster Than Prompts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed max-w-2xl mx-auto">
            Transform natural language into complete, production-ready system architectures. 
            Generate database schemas, API contracts, deployment specs, and agentic workflows tailored for Cursor, Windsurf, and Claude Code.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/add-blueprint"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all hover:scale-[1.01]"
            >
              <span>Build A Blueprint</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blueprints"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] px-6 py-3 text-sm font-semibold text-[#181B20] dark:text-[#F3F4F6] hover:bg-[#F1F3F6] dark:hover:bg-[#171E30] transition-colors"
            >
              <Code2 className="h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF]" />
              <span>Explore Blueprints</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-4 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#0D9488]" /> 5 Spec Markdown Files
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#0D9488]" /> Cursor & Agentic-IDE Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#0D9488]" /> Free Tier Included
            </span>
          </div>
        </div>

        {/* Sleek Preview Window Card */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] shadow-xl overflow-hidden transition-all">
            {/* Top Window Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#E1E4EA] dark:border-[#222C43] bg-[#FAFBFC] dark:bg-[#0A0D17] px-4 py-2.5 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  archflow-output /
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EEF0FF] dark:bg-[#4F46E5]/20 text-[#4F46E5] dark:text-[#818CF8]">
                  {activeSpec.badge}
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white px-2 py-1 rounded bg-[#F1F3F6] dark:bg-[#171E30] transition-colors"
                  title="Copy preview markdown"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Spec File Tabs */}
            <div className="flex overflow-x-auto border-b border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] no-scrollbar">
              {(Object.keys(BLUEPRINT_PREVIEWS) as PreviewKey[]).map((key) => {
                const spec = BLUEPRINT_PREVIEWS[key];
                const TabIcon = spec.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-[#4F46E5] bg-[#EEF0FF]/40 dark:bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8]'
                        : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-[#F3F4F6] hover:bg-[#F1F3F6]/50 dark:hover:bg-[#171E30]/40'
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span>{spec.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Markdown Preview Content */}
            <div className="p-5 bg-[#090C15] text-[#F3F4F6] font-mono text-xs min-h-[220px] overflow-x-auto selection:bg-[#4F46E5]/40">
              <pre className="leading-relaxed text-[#D1D5DB] whitespace-pre-wrap">
                <code>{activeSpec.content}</code>
              </pre>
            </div>

            {/* Card Footer Bar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-[#FAFBFC] dark:bg-[#0A0D17] border-t border-[#E1E4EA] dark:border-[#222C43] text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="flex items-center gap-1.5">
                <ActiveIcon className="h-3.5 w-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
                <span>Active spec: <strong>{activeSpec.name}</strong></span>
              </span>
              <span className="font-mono text-[#0D9488]">Format: Markdown / Agent-Ready</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
