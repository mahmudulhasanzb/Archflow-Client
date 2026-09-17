'use client';

import React, { useState } from 'react';
import { 
  FileCode2, 
  Layers, 
  Database, 
  Network, 
  ListChecks, 
  Check, 
  Copy,
  Terminal
} from 'lucide-react';

export const BLUEPRINT_PREVIEWS = {
  project: {
    name: 'PROJECT_SPEC.md',
    icon: FileCode2,
    badge: 'Overview & Scope',
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
    badge: 'Contracts & RPC',
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

export default function SpecPreviewTerminal() {
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
    <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden transition-all">
      {/* Top Window Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <div className="flex items-center gap-1.5 ml-2 font-mono text-xs text-muted-foreground">
            <Terminal className="h-3 w-3" />
            <span>archflow-output /</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border border-border bg-card text-foreground">
            {activeSpec.badge}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
            title="Copy preview markdown"
          >
            {copied ? <Check className="h-3 w-3 text-foreground" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Spec File Tabs */}
      <div className="flex overflow-x-auto border-b border-border bg-card no-scrollbar">
        {(Object.keys(BLUEPRINT_PREVIEWS) as PreviewKey[]).map((key) => {
          const spec = BLUEPRINT_PREVIEWS[key];
          const TabIcon = spec.icon;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-foreground bg-muted/60 text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{spec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Markdown Preview Content */}
      <div className="p-5 bg-card/50 text-foreground font-mono text-xs min-h-[220px] overflow-x-auto selection:bg-primary selection:text-primary-foreground">
        <pre className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
          <code>{activeSpec.content}</code>
        </pre>
      </div>

      {/* Card Footer Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-muted/40 border-t border-border text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ActiveIcon className="h-3.5 w-3.5 text-foreground" />
          <span>Active spec: <strong className="text-foreground">{activeSpec.name}</strong></span>
        </span>
        <span className="font-mono text-muted-foreground">Format: Markdown / Agent-Ready</span>
      </div>
    </div>
  );
}
