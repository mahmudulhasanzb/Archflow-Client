'use client';

import React, { useState } from 'react';
import { Cpu, Layers, Layout, ShieldAlert, ArrowRight, Code2, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const AGENTS = [
  {
    id: 'architect',
    name: 'Architect Agent',
    role: 'Database & Schema Modeling',
    icon: Cpu,
    accent: '#4F46E5',
    accentSoft: '#EEF0FF',
    badge: 'Data Model Generator',
    description:
      'Creates normalized MongoDB / PostgreSQL schemas, indexing strategies, field validations, and entity-relationship models.',
    sampleOutput: `{
  "collection": "Workspaces",
  "fields": {
    "title": "String (indexed)",
    "ownerId": "ObjectId (ref: User)",
    "settings": "Object (strict validation)"
  },
  "indexes": ["ownerId_1_createdAt_-1"]
}`,
    capabilities: ['Mongoose Schemas', 'Postgres DDL', 'Indexing Optimization', 'Data Validation'],
  },
  {
    id: 'planner',
    name: 'Planner Agent',
    role: 'Roadmap & Task Prioritization',
    icon: Layers,
    accent: '#0D9488',
    accentSoft: '#E6F5F3',
    badge: 'Execution Scheduler',
    description:
      'Deconstructs system requirements into sequential milestones, priority scores, and estimated engineering hours.',
    sampleOutput: `[
  { "milestone": "Phase 1 - Auth & Gateway", "estHours": 8 },
  { "milestone": "Phase 2 - WebSocket Relays", "estHours": 14 },
  { "milestone": "Phase 3 - Metering & Billing", "estHours": 6 }
]`,
    capabilities: ['SPIDR Task Splitting', 'Dependency Mapping', 'Effort Estimates', 'Sprint Roadmap'],
  },
  {
    id: 'documenter',
    name: 'Documenter Agent',
    role: 'API Specs & Setup Stubs',
    icon: Layout,
    accent: '#EA5C34',
    accentSoft: '#FFF0EA',
    badge: 'Code Stub Author',
    description:
      'Writes complete OpenAPI 3.0 documentation, environment setup guides, folder structures, and boilerplate code stubs.',
    sampleOutput: `// Express Route Stub
router.post('/v1/blueprints', authGuard, async (req, res) => {
  const result = await agentSwarm.execute(req.body.prompt);
  res.status(201).json({ success: true, data: result });
});`,
    capabilities: ['OpenAPI 3.0 Specs', 'Express/Fastify Stubs', 'Docker Compose Outlines', 'Setup Guides'],
  },
  {
    id: 'reviewer',
    name: 'Reviewer Agent',
    role: 'Security & Integrity Auditor',
    icon: ShieldAlert,
    accent: '#16A34A',
    accentSoft: '#E7F7EC',
    badge: 'Quality Assurance',
    description:
      'Audits generated schemas against OWASP standards, checks for missing foreign key constraints, and validates data types.',
    sampleOutput: `Audit Results:
✔ OWASP Top 10 Compliance: PASSED
✔ Rate Limiting Guard: DETECTED
✔ Index Optimization: VERIFIED
⚠ Warning: Unencrypted WebSocket payload flag noted.`,
    capabilities: ['OWASP Security Checks', 'Schema Integrity Validation', 'Performance Bottlenecks', 'Compliance QA'],
  },
];

export default function AgentShowcase() {
  const [activeAgentId, setActiveAgentId] = useState('architect');

  const currentAgent = AGENTS.find((a) => a.id === activeAgentId) || AGENTS[0];
  const CurrentIcon = currentAgent.icon;

  return (
    <section className="border-b border-[#E1E4EA] dark:border-[#222C43] bg-[#FAFBFC] dark:bg-[#090C15] py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 border border-[#4F46E5]/30 px-3.5 py-1 text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
            Multi-Agent Command Center
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#181B20] dark:text-[#F3F4F6] font-display">
            Meet Your Specialized AI Agent Swarm
          </h2>
          <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
            Four targeted AI agents work synchronously in a single context loop to deliver seamless, production-ready system designs.
          </p>
        </div>

        {/* Command Center Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: Agent Selector Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              const isSelected = agent.id === activeAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgentId(agent.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? 'bg-white dark:bg-[#0E1321] border-[#4F46E5] shadow-lg ring-1 ring-[#4F46E5]'
                      : 'bg-white/70 dark:bg-[#0E1321]/60 border-[#E1E4EA] dark:border-[#222C43] hover:border-[#4F46E5]/40'
                  }`}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: agent.accentSoft }}
                  >
                    <Icon className="h-5 w-5" style={{ color: agent.accent }} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#181B20] dark:text-[#F3F4F6] font-display truncate">
                        {agent.name}
                      </h3>
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ color: agent.accent, backgroundColor: agent.accentSoft }}
                      >
                        {agent.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2">
                      {agent.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Preview Deck: Active Agent Inspector */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0E1321] rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] p-6 shadow-xl space-y-6">
              
              {/* Deck Header */}
              <div className="flex items-center justify-between border-b border-[#E1E4EA] dark:border-[#222C43] pb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: currentAgent.accentSoft }}
                  >
                    <CurrentIcon className="h-6 w-6" style={{ color: currentAgent.accent }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
                      {currentAgent.name}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      {currentAgent.role}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Agent Ready
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                {currentAgent.description}
              </p>

              {/* Capabilities Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                  Core Capabilities:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentAgent.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#F1F3F6] dark:bg-[#171E30] text-[#181B20] dark:text-[#F3F4F6] font-medium"
                    >
                      <CheckCircle className="h-3 w-3 text-[#4F46E5]" />
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Output Terminal Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Code2 className="h-3.5 w-3.5 text-[#4F46E5]" />
                    Sample Agent Output Stream
                  </span>
                  <span>JSON / TS Output</span>
                </div>
                <div className="bg-[#090C15] p-4 rounded-xl font-mono text-xs text-gray-300 overflow-x-auto border border-gray-800">
                  <pre><code>{currentAgent.sampleOutput}</code></pre>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-2 flex justify-end">
                <Link
                  href="/add-blueprint"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#4338CA] transition-colors"
                >
                  Run Agent Swarm
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
