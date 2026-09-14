'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Code2, ListTodo, Palette, CheckCircle2, Sliders, Shield } from 'lucide-react';

interface MarkdownFiles {
  projectOverview?: string;
  requirements?: string;
  architecture?: string;
  design?: string;
  executionPlan?: string;
}

interface Blueprint {
  _id: string;
  title: string;
  description: string;
  prompt?: string;
  teckStack?: string | string[];
  complexity?: string;
  complexcity?: string;
  visibility?: 'public' | 'private';
  status: string;
  markdownFiles?: MarkdownFiles;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: Blueprint | null;
  onSave: (updatedData: Partial<Blueprint>) => Promise<void>;
  loading: boolean;
}

type TabType = 'metadata' | 'overview' | 'requirements' | 'architecture' | 'design' | 'plan';

export default function EditModal({
  isOpen,
  onClose,
  blueprint,
  onSave,
  loading,
}: EditModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('metadata');

  // Editable fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [complexity, setComplexity] = useState('Medium');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [status, setStatus] = useState('Ready');

  // Markdown files content
  const [projectOverview, setProjectOverview] = useState('');
  const [requirements, setRequirements] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [design, setDesign] = useState('');
  const [executionPlan, setExecutionPlan] = useState('');

  useEffect(() => {
    if (blueprint) {
      setTitle(blueprint.title || '');
      setDescription(blueprint.description || '');
      setPrompt(blueprint.prompt || '');
      
      const stack = blueprint.teckStack;
      if (Array.isArray(stack)) {
        setTechStackInput(stack.join(', '));
      } else if (typeof stack === 'string') {
        setTechStackInput(stack);
      } else {
        setTechStackInput('');
      }

      setComplexity(blueprint.complexity || blueprint.complexcity || 'Medium');
      setVisibility(blueprint.visibility || 'public');
      setStatus(blueprint.status || 'Ready');

      const mf = blueprint.markdownFiles || {};
      setProjectOverview(mf.projectOverview || '');
      setRequirements(mf.requirements || '');
      setArchitecture(mf.architecture || '');
      setDesign(mf.design || '');
      setExecutionPlan(mf.executionPlan || '');
      setActiveTab('metadata');
    }
  }, [blueprint, isOpen]);

  if (!isOpen || !blueprint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Parse tech stack input into clean array
    const teckStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedMarkdownFiles: MarkdownFiles = {
      projectOverview,
      requirements,
      architecture,
      design,
      executionPlan,
    };

    const updatedData: Partial<Blueprint> = {
      title: title.trim(),
      description: description.trim(),
      prompt: prompt.trim(),
      teckStack,
      complexity,
      complexcity: complexity,
      visibility,
      status,
      markdownFiles: updatedMarkdownFiles,
    };

    await onSave(updatedData);
  };

  const navTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'metadata', label: 'General & Specs', icon: Sliders },
    { id: 'overview', label: 'Overview.md', icon: FileText },
    { id: 'requirements', label: 'Requirements.md', icon: ListTodo },
    { id: 'architecture', label: 'Architecture.md', icon: Code2 },
    { id: 'design', label: 'Design.md', icon: Palette },
    { id: 'plan', label: 'ExecutionPlan.md', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#090A0C]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col transform rounded-2xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] shadow-2xl transition-all z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E1E4EA] dark:border-[#222C43] bg-[#FAFBFC] dark:bg-[#090C15]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
                Edit Architecture Blueprint
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                PRO FEATURE
              </span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
              Edit architecture parameters and deterministic Markdown specifications. Immutable fields (creation date, ratings, author) are protected.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-50/60 dark:bg-[#0A0D18] border-b border-[#E1E4EA] dark:border-[#222C43] overflow-x-auto text-xs">
          {navTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#181B20] dark:hover:text-white hover:bg-white dark:hover:bg-[#141A29]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
            {/* TAB 1: General & Specs */}
            {activeTab === 'metadata' && (
              <div className="space-y-4">
                {/* Title Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                    Blueprint Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Microservices eCommerce API"
                    className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100"
                    disabled={loading}
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                    Executive Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a description of the target system structure..."
                    className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100"
                    disabled={loading}
                  />
                </div>

                {/* AI Prompt */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                    AI Source Prompt
                  </label>
                  <textarea
                    rows={2}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Original prompt used to seed the architecture..."
                    className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100"
                    disabled={loading}
                  />
                </div>

                {/* Tech Stack Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, Next.js, Node.js, MongoDB"
                    className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100"
                    disabled={loading}
                  />
                </div>

                {/* Complexity, Visibility & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                      Complexity
                    </label>
                    <select
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                      className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 cursor-pointer"
                      disabled={loading}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                      Visibility
                    </label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                      className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 cursor-pointer"
                      disabled={loading}
                    >
                      <option value="public">Public (Shared in Gallery)</option>
                      <option value="private">Private (Workspace Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#181B20] dark:text-[#E2E8F0] mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border border-[#E1E4EA] dark:border-[#222C43] px-3.5 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 cursor-pointer"
                      disabled={loading}
                    >
                      <option value="Ready">Ready</option>
                      <option value="Generating">Generating</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Protected fields notice */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#090C15] border border-slate-200/60 dark:border-[#222C43] text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong>Protected fields:</strong> Author email, creation timestamp, and community ratings cannot be altered.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: projectOverview.md */}
            {activeTab === 'overview' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-[#181B20] dark:text-[#E2E8F0]">
                    projectOverview.md Content
                  </label>
                  <span className="text-[11px] text-[#6B7280]">Markdown format</span>
                </div>
                <textarea
                  rows={14}
                  value={projectOverview}
                  onChange={(e) => setProjectOverview(e.target.value)}
                  placeholder="# Project Overview..."
                  className="w-full font-mono text-xs rounded-xl border border-[#E1E4EA] dark:border-[#222C43] p-4 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 3: requirements.md */}
            {activeTab === 'requirements' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-[#181B20] dark:text-[#E2E8F0]">
                    requirements.md Content
                  </label>
                  <span className="text-[11px] text-[#6B7280]">Markdown format</span>
                </div>
                <textarea
                  rows={14}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="# Requirements..."
                  className="w-full font-mono text-xs rounded-xl border border-[#E1E4EA] dark:border-[#222C43] p-4 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 4: architecture.md */}
            {activeTab === 'architecture' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-[#181B20] dark:text-[#E2E8F0]">
                    architecture.md Content
                  </label>
                  <span className="text-[11px] text-[#6B7280]">Markdown format</span>
                </div>
                <textarea
                  rows={14}
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  placeholder="# System Architecture..."
                  className="w-full font-mono text-xs rounded-xl border border-[#E1E4EA] dark:border-[#222C43] p-4 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 5: design.md */}
            {activeTab === 'design' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-[#181B20] dark:text-[#E2E8F0]">
                    design.md Content
                  </label>
                  <span className="text-[11px] text-[#6B7280]">Markdown format</span>
                </div>
                <textarea
                  rows={14}
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                  placeholder="# Design System Specifications..."
                  className="w-full font-mono text-xs rounded-xl border border-[#E1E4EA] dark:border-[#222C43] p-4 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 6: executionPlan.md */}
            {activeTab === 'plan' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-[#181B20] dark:text-[#E2E8F0]">
                    executionPlan.md Content
                  </label>
                  <span className="text-[11px] text-[#6B7280]">Markdown format</span>
                </div>
                <textarea
                  rows={14}
                  value={executionPlan}
                  onChange={(e) => setExecutionPlan(e.target.value)}
                  placeholder="# Agentic IDE Execution Plan..."
                  className="w-full font-mono text-xs rounded-xl border border-[#E1E4EA] dark:border-[#222C43] p-4 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white dark:bg-[#090C15] text-slate-800 dark:text-slate-100 leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-[#E1E4EA] dark:border-[#222C43] p-4 bg-[#FAFBFC] dark:bg-[#090C15]">
            <div className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              All changes are synced live to the database.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] px-4 py-2 text-xs font-semibold text-[#181B20] dark:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
