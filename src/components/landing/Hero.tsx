'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Terminal, Cpu, Layers, Layout, ShieldCheck, Check, Copy, Play } from 'lucide-react';
import Link from 'next/link';

const PRESET_PROMPTS = [
  'Realtime Collaborative Canvas with WebSockets',
  'Multi-tenant Microservice Gateway with Rate Limiting',
  'Serverless Event-Driven SaaS Billing Engine',
];

const AGENT_TAB_OUTPUTS = {
  architect: {
    title: 'Architect Agent (Schema & Models)',
    icon: Cpu,
    color: '#4F46E5',
    status: 'Valid JSON Schema',
    snippet: `// Generated MongoDB / Mongoose Blueprint Schema
const WorkspaceSchema = new Schema({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  crdtState: { type: Buffer, required: true },
  version: { type: Number, default: 1 },
}, { timestamps: true });

WorkspaceSchema.index({ ownerId: 1, createdAt: -1 });`,
  },
  planner: {
    title: 'Planner Agent (Implementation Roadmap)',
    icon: Layers,
    color: '#0D9488',
    status: '3 Milestones • 12 Tasks',
    snippet: `[Phase 1: Foundation]
 ├── Setup Redis Pub/Sub cluster for WebSocket scaling
 ├── Define JWT Auth interceptor middleware
 └── Provision CRDT state sync engine (Yjs / Automerge)

[Phase 2: Core API]
 ├── Impl /api/v1/workspaces POST handler
 └── Write rate-limiter middleware (100 req/min)`,
  },
  documenter: {
    title: 'Documenter Agent (API & Setup Stubs)',
    icon: Layout,
    color: '#EA5C34',
    status: 'OpenAPI 3.0 Specs Ready',
    snippet: `# API Endpoint Reference
POST /api/v1/workspaces/sync
Headers: 
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
Payload:
  { "docId": "ws_9921", "changeset": "base64..." }
Response: 200 OK { "status": "synced", "ack": 1042 }`,
  },
  reviewer: {
    title: 'Reviewer Agent (Security & Performance Audit)',
    icon: ShieldCheck,
    color: '#16A34A',
    status: 'Pass: 0 Vulnerabilities Detected',
    snippet: `✔ Authentication: JWT bearer token validation verified.
✔ Rate Limiting: Redis sliding-window algorithm present.
✔ Data Integrity: Strict Mongoose index on ownerId enforced.
✔ Recommendation: Add TLS encryption for WebSocket relays on port 8443.`,
  },
};

export default function Hero() {
  const [selectedPrompt, setSelectedPrompt] = useState(PRESET_PROMPTS[0]);
  const [activeTab, setActiveTab] = useState<'architect' | 'planner' | 'documenter' | 'reviewer'>('architect');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeAgent = AGENT_TAB_OUTPUTS[activeTab];
  const Icon = activeAgent.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAgent.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  return (
    <section className="relative min-h-screen border-b border-[#E1E4EA] dark:border-[#222C43] bg-mesh bg-grid-pattern px-4 py-16 sm:py-24 text-left overflow-hidden">
      {/* Background radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-[#4F46E5]/15 to-[#0D9488]/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 border border-[#4F46E5]/30 px-3.5 py-1.5 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>AI Software Architect Pipeline v2.0</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-[#181B20] dark:text-[#F3F4F6] sm:text-5xl lg:text-6xl font-display leading-[1.1]">
              Turn Ideas Into <br />
              <span className="text-gradient-primary">
                Production Blueprints
              </span>
              <br />
              In Seconds
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed max-w-xl">
              Stop spending days writing manual schemas, API specs, and task lists. Four specialized AI agents collaborate live to generate end-to-end technical architectures for your apps.
            </p>

            {/* Sample Prompt Selector */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#4F46E5]" />
                Try A Sample Spec Prompt:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      handleRunSimulation();
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 text-left ${
                      selectedPrompt === prompt
                        ? 'border-[#4F46E5] bg-[#EEF0FF] dark:bg-[#4F46E5]/20 text-[#4F46E5] dark:text-[#818CF8] font-semibold'
                        : 'border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] text-[#6B7280] hover:border-[#4F46E5]/50'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/add-blueprint"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#4F46E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4F46E5]/25 hover:bg-[#4338CA] transition-all hover:scale-[1.02]"
              >
                Build My Blueprint
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] px-6 py-3.5 text-sm font-bold text-[#181B20] dark:text-[#F3F4F6] hover:bg-[#F1F3F6] dark:hover:bg-[#171E30] transition-colors"
              >
                Explore Public Blueprints
              </Link>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-6 border-t border-[#E1E4EA]/80 dark:border-[#222C43]/80">
              <p className="text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2">
                Supported Stacks & Databases:
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                <span className="px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30]">Node.js</span>
                <span className="px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30]">Next.js</span>
                <span className="px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30]">MongoDB</span>
                <span className="px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30]">PostgreSQL</span>
                <span className="px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30]">Redis</span>
                <span className="px-2 py-0.5 rounded bg-[#F1F3F6] dark:bg-[#171E30]">Docker</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Agent Blueprint Preview Terminal */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-2xl p-1 shadow-2xl glow-indigo-box overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E4EA] dark:border-[#222C43] bg-[#FAFBFC]/80 dark:bg-[#0E1321]/80">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] truncate max-w-[200px]">
                    archflow-pipeline.ts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunSimulation}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F46E5] dark:text-[#818CF8] bg-[#EEF0FF] dark:bg-[#4F46E5]/20 px-2.5 py-1 rounded hover:bg-[#4F46E5]/20 transition-colors"
                  >
                    <Play className="h-3 w-3" />
                    Re-run Agents
                  </button>
                </div>
              </div>

              {/* Input prompt preview bar */}
              <div className="bg-[#F1F3F6]/70 dark:bg-[#171E30]/70 px-4 py-2.5 border-b border-[#E1E4EA] dark:border-[#222C43] flex items-center justify-between text-xs font-mono text-[#181B20] dark:text-[#F3F4F6]">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#4F46E5] font-bold">&gt;</span>
                  <span className="truncate">"{selectedPrompt}"</span>
                </div>
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Pipeline Idle
                </span>
              </div>

              {/* Agent Tabs */}
              <div className="grid grid-cols-4 bg-white dark:bg-[#090C15] border-b border-[#E1E4EA] dark:border-[#222C43] text-xs">
                {(['architect', 'planner', 'documenter', 'reviewer'] as const).map((tabKey) => {
                  const info = AGENT_TAB_OUTPUTS[tabKey];
                  const TabIcon = info.icon;
                  const isActive = activeTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 gap-1 border-b-2 transition-all ${
                        isActive
                          ? 'border-[#4F46E5] bg-[#EEF0FF]/40 dark:bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] font-bold'
                          : 'border-transparent text-[#6B7280] hover:text-[#181B20] dark:hover:text-[#F3F4F6]'
                      }`}
                    >
                      <TabIcon className="h-4 w-4" style={{ color: isActive ? info.color : undefined }} />
                      <span className="capitalize text-[11px] truncate">{tabKey}</span>
                    </button>
                  );
                })}
              </div>

              {/* Code Snippet & Agent Status Body */}
              <div className="p-4 bg-[#090C15] text-[#F3F4F6] font-mono text-xs relative min-h-[220px]">
                
                {/* Agent Status Badge */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: activeAgent.color }} />
                    <span className="font-bold text-gray-200">{activeAgent.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    {activeAgent.status}
                  </span>
                </div>

                {/* Simulated Loading or Snippet */}
                {isSimulating ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3 text-gray-400">
                    <Cpu className="h-8 w-8 text-[#4F46E5] animate-spin" />
                    <p className="text-xs">Agents analyzing prompt specifications...</p>
                  </div>
                ) : (
                  <div className="relative group">
                    <pre className="overflow-x-auto text-[11px] leading-relaxed text-gray-300">
                      <code>{activeAgent.snippet}</code>
                    </pre>

                    <button
                      onClick={handleCopy}
                      className="absolute top-0 right-0 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                      title="Copy snippet"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer bar */}
              <div className="px-4 py-2 bg-[#FAFBFC] dark:bg-[#0E1321] border-t border-[#E1E4EA] dark:border-[#222C43] flex items-center justify-between text-[11px] text-[#6B7280]">
                <span>Generated in 0.42s</span>
                <span className="font-mono text-[#4F46E5] dark:text-[#818CF8]">4 AI Agents Active</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
