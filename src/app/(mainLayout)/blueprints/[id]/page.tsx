'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { baseURL } from '@/lib/api/baseUrl';
import { ArrowLeft, Cpu, Layers, Layout, ShieldAlert, Calendar, Star, BookOpen, AlertCircle } from 'lucide-react';

interface AgentStep {
  content: string;
  status: string;
}

interface Blueprint {
  _id: string;
  title: string;
  shortDescription?: string;
  description: string;
  stack: string;
  complexity?: string;
  rating?: number;
  status: string;
  currentStep: string;
  createdAt: string;
  steps: {
    Architect: AgentStep;
    Planner: AgentStep;
    Documenter: AgentStep;
    Reviewer: AgentStep;
  };
}

export default function BlueprintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'roadmap' | 'docs' | 'review'>('overview');

  const defaultMockBlueprint: Blueprint = {
    _id: id,
    title: 'Realtime Collaborative Editor',
    shortDescription: 'Multiplayer document editing using Yjs CRDTs and WebSocket relays.',
    description: 'A complete collaborative suite containing document delta sync models, synchronization engines, and multi-tenant scaling components. Built with high performance standards for collaborative corporate apps.',
    stack: 'Next.js + WebSockets',
    complexity: 'High',
    rating: 4.9,
    status: 'Ready',
    currentStep: 'Ready',
    createdAt: new Date().toISOString(),
    steps: {
      Architect: {
        content: `### Database Schema Design
Designed for **Realtime Collaborative Editor** using **Next.js + WebSockets**.

#### 1. Collections & Documents

\`\`\`json
// Documents Collection
{
  "_id": "ObjectId",
  "title": "String",
  "content": "String (Yjs binary state / delta update history)",
  "ownerId": "ObjectId (References Users)",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}

// Collaborators Collection
{
  "_id": "ObjectId",
  "documentId": "ObjectId (References Documents)",
  "userId": "ObjectId (References Users)",
  "accessLevel": "String (read|write|admin)"
}
\`\`\`

#### 2. Relations & References
- **One-to-Many**: One document has multiple collaborators.
- **Index**: Compound unique index on \`documentId\` and \`userId\` to prevent redundant access rows.`,
        status: 'completed'
      },
      Planner: {
        content: `### Task Roadmap & Milestones
Project implementation plan for **Realtime Collaborative Editor**.

#### Phase 1: Foundation & WebSockets (Complexity: Low)
- [x] Configure Next.js Tailwind layout styling
- [x] Set up WebSocket server socket connections
- [x] Establish authentication handshake validations

#### Phase 2: Document Synchronization (Complexity: High)
- [ ] Integrate Yjs binding listeners on client textarea
- [ ] Write delta document state serialization logic
- [ ] Connect Redis pub/sub adapter for multi-node scaling`,
        status: 'completed'
      },
      Documenter: {
        content: `### Project Documentation
API Reference and developer guide.

#### Getting Started
1. Install dependencies:
   \`\`\`bash
   npm install yjs y-websocket express
   \`\`\`
2. Set up environmental configuration:
   \`\`\`env
   PORT=5000
   WS_URL=ws://localhost:5000
   \`\`\`
3. Start the node server:
   \`\`\`bash
   node server.js
   \`\`\`

#### WS Message Types
- \`sync-step-1\`: Client requests baseline document states.
- \`sync-update\`: Delta update message passing Yjs transaction payloads.`,
        status: 'completed'
      },
      Reviewer: {
        content: `### Architectural Review Report
System evaluation for **Realtime Collaborative Editor**.

#### 1. Security Analysis
- **WebSocket Validation**: Ensure auth tokens are verified during socket handshakes, not after connection.
- **Rate Limiting**: Limit payload size per frame to 5MB to avoid memory overflow attacks.

#### 2. Performance & Scaling
- **Redis Adapters**: Essential to scale WebSocket servers across multiple instances to preserve shared session memories.`,
        status: 'completed'
      }
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseURL}/api/blueprints/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setBlueprint(data);
      } catch (err) {
        console.warn('API details fetch failed. Falling back to mock details.');
        // Make sure title matches if it was a known mock
        const mockItem = id === 'mock2' ? {
          ...defaultMockBlueprint,
          _id: 'mock2',
          title: 'Microservice Gateway Pattern',
          stack: 'Express.js + Node',
          complexity: 'Medium',
          rating: 4.7
        } : defaultMockBlueprint;
        setBlueprint(mockItem);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center animate-pulse flex-grow">
        <div className="h-6 bg-[#F1F3F6] rounded-md w-1/4 mx-auto mb-6" />
        <div className="h-4 bg-[#F1F3F6] rounded-md w-1/2 mx-auto mb-12" />
        <div className="border border-[#E1E4EA] rounded-xl bg-white p-8 space-y-6">
          <div className="h-4 bg-[#F1F3F6] rounded-md w-1/3" />
          <div className="h-20 bg-[#F1F3F6] rounded-md w-full" />
          <div className="h-4 bg-[#F1F3F6] rounded-md w-1/4" />
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center flex-grow">
        <AlertCircle className="mx-auto h-12 w-12 text-[#EA5C34] mb-4" />
        <h2 className="text-xl font-bold text-[#181B20] font-display">Blueprint Not Found</h2>
        <p className="text-sm text-[#6B7280] mt-2">The requested blueprint could not be resolved.</p>
        <Link href="/explore" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#4F46E5]">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/explore" className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] hover:text-[#181B20] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
        </Link>
      </div>

      {/* Main Title Section */}
      <div className="border-b border-[#E1E4EA] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#181B20] font-display">{blueprint.title}</h1>
            <p className="text-sm text-[#6B7280] mt-2 max-w-3xl">{blueprint.shortDescription || blueprint.description}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              {blueprint.stack}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F3] px-3 py-1 text-xs font-semibold text-[#0D9488]">
              {blueprint.complexity || 'Medium'} Complexity
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-[#6B7280] font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Created: {new Date(blueprint.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-[#D97706] fill-[#D97706]" />
            Rating: {blueprint.rating || '4.8'}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
            Status: {blueprint.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E1E4EA] mb-8">
        <nav className="flex space-x-8 text-sm font-semibold">
          {[
            { id: 'overview', name: 'Overview', icon: BookOpen },
            { id: 'schema', name: 'Database Schema (Architect)', icon: Cpu },
            { id: 'roadmap', name: 'Task Roadmap (Planner)', icon: Layers },
            { id: 'docs', name: 'API Docs & Stubs (Documenter)', icon: Layout },
            { id: 'review', name: 'QA & Security (Reviewer)', icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-display transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-[#6B7280] hover:text-[#181B20]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-xl border border-[#E1E4EA] p-8 shadow-sm min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#181B20] font-display">Project Description</h2>
            <p className="text-[#6B7280] leading-relaxed text-sm whitespace-pre-line">{blueprint.description}</p>
            
            <div className="pt-6 border-t border-[#E1E4EA] grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-bold text-[#181B20] font-display">Target Stack</h3>
                <p className="text-[#6B7280] mt-1">{blueprint.stack}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#181B20] font-display">Complexity Reference</h3>
                <p className="text-[#6B7280] mt-1">{blueprint.complexity || 'Medium'} Level</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="prose max-w-none text-sm text-[#6B7280] whitespace-pre-line leading-relaxed font-mono">
            {blueprint.steps.Architect.content || 'Architect stage logs are pending...'}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="prose max-w-none text-sm text-[#6B7280] whitespace-pre-line leading-relaxed">
            {blueprint.steps.Planner.content || 'Planner stage roadmap is pending...'}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="prose max-w-none text-sm text-[#6B7280] whitespace-pre-line leading-relaxed">
            {blueprint.steps.Documenter.content || 'Documenter scripts and setups are pending...'}
          </div>
        )}

        {activeTab === 'review' && (
          <div className="prose max-w-none text-sm text-[#6B7280] whitespace-pre-line leading-relaxed">
            {blueprint.steps.Reviewer.content || 'Reviewer feedback is pending...'}
          </div>
        )}
      </div>
    </div>
  );
}
