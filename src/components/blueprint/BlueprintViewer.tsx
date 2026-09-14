'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import {
  Download,
  Copy,
  Check,
  FileText,
  ListTodo,
  Code2,
  Palette,
  CheckCircle2,
  Sparkles,
  Lock,
  Globe,
  Layers,
  Terminal,
  Eye,
  Code,
} from 'lucide-react';
import MdxRenderer from '@/components/mdx/MdxRenderer';

interface MarkdownFiles {
  projectOverview?: string;
  requirements?: string;
  architecture?: string;
  design?: string;
  executionPlan?: string;
}

interface BlueprintViewerProps {
  blueprint: {
    _id: string;
    title: string;
    description?: string;
    prompt?: string;
    teckStack?: string[] | string;
    complexcity?: string;
    visibility?: 'public' | 'private';
    markdownFiles?: MarkdownFiles;
    architectureFlow?: {
      architecture?: { title: string; description: string };
      features?: { title: string; description: string };
      plan?: { title: string; description: string };
    };
    author?: string;
    createdAt?: string;
  };
}

interface TabDef {
  key: keyof MarkdownFiles;
  name: string;
  filename: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabDef[] = [
  {
    key: 'projectOverview',
    name: 'Overview',
    filename: 'projectOverview.md',
    icon: FileText,
    description: 'Master briefing file with problem statement, dev commands, and architecture principles.',
  },
  {
    key: 'requirements',
    name: 'Requirements',
    filename: 'requirements.md',
    icon: ListTodo,
    description: 'Functional requirements, user personas, acceptance criteria, and edge cases.',
  },
  {
    key: 'architecture',
    name: 'Architecture',
    filename: 'architecture.md',
    icon: Code2,
    description: 'ASCII directory structure, route map, database schemas, and API contracts.',
  },
  {
    key: 'design',
    name: 'Design System',
    filename: 'design.md',
    icon: Palette,
    description: 'Design tokens, theme palette, typography scale, component hierarchy, and responsiveness.',
  },
  {
    key: 'executionPlan',
    name: 'Execution Plan',
    filename: 'executionPlan.md',
    icon: CheckCircle2,
    description: 'Agentic IDE phased task roadmap with [ ] checkboxes and explicit verification commands.',
  },
];

export default function BlueprintViewer({ blueprint }: BlueprintViewerProps) {
  const [activeTab, setActiveTab] = useState<keyof MarkdownFiles>('projectOverview');
  const [viewMode, setViewMode] = useState<'mdx' | 'raw'>('mdx');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const hasMarkdownFiles = Boolean(blueprint.markdownFiles && Object.keys(blueprint.markdownFiles).length > 0);

  // Copy single file
  const handleCopy = async (filename: string, content: string | undefined) => {
    if (!content) {
      toast.error('No content to copy.');
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(filename);
      toast.success(`Copied ${filename} to clipboard!`);
      setTimeout(() => setCopiedTab(null), 2500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy to clipboard.');
    }
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const slug = blueprint.title
        ? blueprint.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32)
        : 'archflow-blueprint';

      if (blueprint.markdownFiles) {
        zip.file('projectOverview.md', blueprint.markdownFiles.projectOverview || '# Project Overview\n');
        zip.file('requirements.md', blueprint.markdownFiles.requirements || '# Requirements\n');
        zip.file('architecture.md', blueprint.markdownFiles.architecture || '# Architecture\n');
        zip.file('design.md', blueprint.markdownFiles.design || '# Design System\n');
        zip.file('executionPlan.md', blueprint.markdownFiles.executionPlan || '# Execution Plan\n');
      } else if (blueprint.architectureFlow) {
        // Fallback for legacy blueprints
        zip.file('architecture.md', `# ${blueprint.architectureFlow.architecture?.title || 'Architecture'}\n\n${blueprint.architectureFlow.architecture?.description || ''}`);
        zip.file('requirements.md', `# ${blueprint.architectureFlow.features?.title || 'Features'}\n\n${blueprint.architectureFlow.features?.description || ''}`);
        zip.file('executionPlan.md', `# ${blueprint.architectureFlow.plan?.title || 'Execution Plan'}\n\n${blueprint.architectureFlow.plan?.description || ''}`);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-blueprint.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded blueprint suite (.zip)!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  // Current active file content
  const activeContent = blueprint.markdownFiles?.[activeTab] || 'No content generated for this section.';
  const currentTabDef = TABS.find(t => t.key === activeTab) || TABS[0];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#181B20] dark:text-[#F3F4F6]">
                Agentic IDE Suite
              </span>
              {blueprint.visibility === 'private' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Lock className="h-2.5 w-2.5" /> Private
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#6B7280]">
                  <Globe className="h-2.5 w-2.5" /> Public
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              {hasMarkdownFiles ? '5 deterministic markdown specifications ready for Cursor, Antigravity, or Claude Code.' : 'Legacy blueprint specifications.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isZipping ? 'Archiving...' : 'Download Suite (.zip)'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 border-b border-[#E1E4EA] dark:border-[#222C43] pb-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const isPlan = tab.key === 'executionPlan';
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isPlan
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100'
                    : 'bg-white dark:bg-[#0E1321] border border-[#E1E4EA] dark:border-[#222C43] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.filename}</span>
                {isPlan && !isActive && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                    Agent
                  </span>
                )}
              </button>
            );
          })}
        </div>

          {/* Active File Preview Card */}
          <div className="rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] shadow-sm overflow-hidden">
            {/* Card File Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#FAFBFC] dark:bg-[#090C15] border-b border-[#E1E4EA] dark:border-[#222C43]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#181B20] dark:text-[#F3F4F6]">
                    {currentTabDef.filename}
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">
                    ({activeContent.split(/\s+/).length} words, {activeContent.length} bytes)
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  {currentTabDef.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="inline-flex items-center p-0.5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321]">
                  <button
                    onClick={() => setViewMode('mdx')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      viewMode === 'mdx'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white'
                    }`}
                    title="Rendered MDX Document with Syntax Highlighting"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>MDX Preview</span>
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      viewMode === 'raw'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white'
                    }`}
                    title="Raw Markdown Code"
                  >
                    <Code className="h-3.5 w-3.5" />
                    <span>Raw Code</span>
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(currentTabDef.filename, activeContent)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] px-3 py-1.5 text-xs font-semibold text-[#181B20] dark:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  {copiedTab === currentTabDef.filename ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#6B7280]" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Markdown Document Content Area */}
            <div className="p-6 overflow-x-auto max-h-[700px] overflow-y-auto">
              {viewMode === 'mdx' ? (
                <MdxRenderer content={activeContent} />
              ) : (
                <pre className="font-mono text-xs text-[#181B20] dark:text-[#E2E8F0] whitespace-pre-wrap leading-relaxed">
                  {activeContent}
                </pre>
              )}
            </div>

            {/* Bottom Card Footer Tip */}
            {activeTab === 'executionPlan' && (
              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 border-t border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Agentic IDE Command:</strong> Paste this file into your project as <code className="font-mono bg-white dark:bg-indigo-950 px-1 rounded">executionPlan.md</code> and prompt your agent: <em>&quot;Implement Step 1 from executionPlan.md&quot;</em>.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
