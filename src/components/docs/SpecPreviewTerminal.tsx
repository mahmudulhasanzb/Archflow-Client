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
  projectOverview: {
    name: 'projectOverview.md',
    icon: FileCode2,
    badge: 'Overview & Setup',
    content: `# FlowForge - Real-Time Collaborative Architecture Suite

## 1. Executive Summary & Problem Solved
FlowForge provides distributed real-time diagramming for systems engineering teams. Eliminates architectural drift between whiteboard drawings and deployed infrastructure code.

## 2. Target Users & Value Proposition
- Staff & Lead Architects: Rapid high-level component topology modeling.
- AI Coding Agents: Contextual grounding to eliminate hallucinated routes or missing schemas.

## 3. Tech Stack Rationale
- Frontend: Next.js 16 (App Router), Tailwind CSS v4, HeroUI for high-contrast accessibility.
- Backend: Express 5 single-file micro-gateway with native MongoDB driver connection pooling.
- Auth: Better Auth with JWKS public key bridge for stateless token verification.
- Real-Time: WebSocket CRDT state sync engine with Redis channel replication.

## 4. Environment Setup
PORT=5000
MONGODB_URI=mongodb+srv://.../flowforge
BETTER_AUTH_URL=http://localhost:3000
JWKS_CACHE_TTL_MS=3600000`,
  },
  requirements: {
    name: 'requirements.md',
    icon: ListChecks,
    badge: 'Requirements & Scope',
    content: `# Requirements & Functional Specifications

## 1. Target Personas
- P-01 (Architect): Requires fast visual topology canvas, SVG export, and live presence.
- P-02 (AI Coding Agent): Consumes executionPlan.md to generate components without ambiguity.

## 2. Core Functional Requirements
### REQ-01: Real-Time Canvas Multi-Tenancy
- Description: Canvas state must synchronize across all joined clients within 25ms.
- Acceptance Criteria:
  - [x] Concurrent cursor coordinates broadcast via WebSockets.
  - [x] Optimistic node creation with server ACK resolution.
  - [x] Conflict-free resolution via CRDT state vector.

### REQ-02: Deterministic Schema Persistence
- Description: Canvas snapshots auto-persist to MongoDB every 5 seconds or upon blur.
- Acceptance Criteria:
  - [x] Debounced save mechanism to avoid write amplification.
  - [x] Version integer incremented on each persisted snapshot.

## 3. Non-Functional Requirements
- Sub-50ms p95 API response time.
- Zero client bundle dependency on heavy ORM runtimes.`,
  },
  architecture: {
    name: 'architecture.md',
    icon: Layers,
    badge: 'System Architecture',
    content: `# System Architecture & Topology

## 1. High-Level Component Topology
Client (Next.js 16) ──[HTTPS/WSS]──> Express 5 Gateway ──> MongoDB Replica
                                         │
                                         └──> Redis Pub/Sub (Presence)

## 2. Directory Structure (ASCII)
├── apps/web/
│   ├── src/
│   │   ├── app/                 # Public views & workspace canvas
│   │   ├── components/          # Canvas rendering & toolbar widgets
│   │   └── lib/                 # Real-time WebSocket & state hooks
└── apps/api/
    └── src/
        └── server.ts            # High-performance gateway & sync engine

## 3. Data Models & Schemas
Collection: canvases
{
  "_id": ObjectId("..."),
  "title": "String (required, indexed)",
  "ownerId": "String (indexed)",
  "state": "Binary (CRDT)",
  "metrics": { "views": 142, "editors": 8 },
  "updatedAt": ISODate("2026-09-17T12:00:00Z")
}
Indexes: { title: "text" }, { ownerId: 1 }`,
  },
  design: {
    name: 'design.md',
    icon: Database,
    badge: 'Design System',
    content: `# Design System & UI Architecture

## 1. Visual Direction & Theme
- Obsidian Dark & Paper Light: Deep slate background (#090d16) with high-contrast surfaces (#111827) and muted zinc borders (#1f2937).
- Accent: Precision indigo/violet primary gradient (#6366f1 -> #8b5cf6).

## 2. Typography Scale
- Display: Plus Jakarta Sans / Outfit (Headings, bold tracking -0.02em).
- Body: Inter / Geist (Clean readability, 14px/16px line-height 1.6).
- Code: JetBrains Mono / Fira Code (ASCII trees, env variables, bash scripts).

## 3. Component Hierarchy
- Header: Compact sticky bar (avatar, title, telemetry, bookmark, rate).
- Workbench Tabs: Sticky file switcher with active tab contrast pill.
- Viewer Container: Responsive min-w-0 wrapper with raw markdown toggle and 1-click clipboard copy.`,
  },
  executionPlan: {
    name: 'executionPlan.md',
    icon: ListChecks,
    badge: 'Execution Roadmap',
    content: `# Agentic Execution Plan

## Phase 1: Database Foundation & Auth Bridge
- [ ] Task 1.1: Initialize connection pooling & health checks
  - File: apps/api/src/server.ts
  - Verify: curl -f http://localhost:5000/api/health
- [ ] Task 1.2: Configure cryptographic session token verification
  - File: apps/api/src/auth.ts
  - Verify: npm test -- tests/auth.test.ts

## Phase 2: Real-time State & CRDT Engine
- [ ] Task 2.1: Implement binary vector synchronization pipeline
  - File: apps/web/src/engine/crdt.ts
  - Verify: npm test -- tests/crdt.test.ts
- [ ] Task 2.2: Add presence channel broadcast with rate limiting
  - File: apps/api/src/server.ts
  - Verify: npm test -- tests/presence.test.ts

## Phase 3: Interactive Canvas UI
- [ ] Task 3.1: Build optimistic rendering canvas viewport
  - File: apps/web/src/components/CanvasViewer.tsx
  - Verify: npx tsc --noEmit`,
  },
};

type PreviewKey = keyof typeof BLUEPRINT_PREVIEWS;

export default function SpecPreviewTerminal() {
  const [activeTab, setActiveTab] = useState<PreviewKey>('projectOverview');
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
