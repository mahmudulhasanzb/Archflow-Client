'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  FileText,
  Code2,
  ListTodo,
  Palette,
  CheckCircle2,
  Sliders,
  Shield,
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

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

type TabType =
  | 'metadata'
  | 'overview'
  | 'requirements'
  | 'architecture'
  | 'design'
  | 'plan';

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
      .map(s => s.trim())
      .filter(s => s.length > 0);

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

  const navTabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col transform rounded-2xl border border-border bg-card shadow-2xl transition-all z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground font-display">
                Edit Architecture Blueprint
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                PRO FEATURE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit architecture parameters and deterministic Markdown
              specifications. Immutable fields (creation date, ratings, author)
              are protected.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-card border-b border-border overflow-x-auto text-xs">
          {navTabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
            {/* TAB 1: General & Specs */}
            {activeTab === 'metadata' && (
              <div className="space-y-4">
                {/* Title Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Blueprint Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Microservices eCommerce API"
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-none bg-background text-foreground"
                    disabled={loading}
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Executive Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide a description of the target system structure..."
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-none bg-background text-foreground"
                    disabled={loading}
                  />
                </div>

                {/* AI Prompt */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    AI Source Prompt
                  </label>
                  <textarea
                    rows={2}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Original prompt used to seed the architecture..."
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-none bg-background text-foreground"
                    disabled={loading}
                  />
                </div>

                {/* Tech Stack Field */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={e => setTechStackInput(e.target.value)}
                    placeholder="React, Next.js, Node.js, MongoDB"
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-none bg-background text-foreground"
                    disabled={loading}
                  />
                </div>

                {/* Complexity, Visibility & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Complexity
                    </label>
                    <CustomSelect
                      value={complexity}
                      onChange={setComplexity}
                      disabled={loading}
                      triggerClassName="bg-background"
                      options={[
                        { value: 'Low', label: 'Low', badge: 'MVP' },
                        { value: 'Medium', label: 'Medium', badge: 'MID' },
                        { value: 'High', label: 'High', badge: 'HIGH' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Visibility
                    </label>
                    <CustomSelect
                      value={visibility}
                      onChange={val => setVisibility(val as 'public' | 'private')}
                      disabled={loading}
                      triggerClassName="bg-background"
                      options={[
                        { value: 'public', label: 'Public', badge: 'GALLERY', description: 'Shared in Explore Gallery' },
                        { value: 'private', label: 'Private', badge: 'PRO', description: 'Workspace Only' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Status
                    </label>
                    <CustomSelect
                      value={status}
                      onChange={setStatus}
                      disabled={loading}
                      triggerClassName="bg-background"
                      options={[
                        { value: 'Ready', label: 'Ready', badge: 'ACTIVE' },
                        { value: 'Generating', label: 'Generating', badge: 'BUILD' },
                        { value: 'Failed', label: 'Failed', badge: 'ERR' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* TAB 2: projectOverview.md */}
            {activeTab === 'overview' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-foreground">
                    projectOverview.md Content
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Markdown format
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={projectOverview}
                  onChange={e => setProjectOverview(e.target.value)}
                  placeholder="# Project Overview..."
                  className="w-full font-mono text-xs rounded-xl border border-border p-4 focus:border-foreground focus:outline-none bg-background text-foreground leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 3: requirements.md */}
            {activeTab === 'requirements' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-foreground">
                    requirements.md Content
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Markdown format
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={requirements}
                  onChange={e => setRequirements(e.target.value)}
                  placeholder="# Requirements..."
                  className="w-full font-mono text-xs rounded-xl border border-border p-4 focus:border-foreground focus:outline-none bg-background text-foreground leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 4: architecture.md */}
            {activeTab === 'architecture' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-foreground">
                    architecture.md Content
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Markdown format
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={architecture}
                  onChange={e => setArchitecture(e.target.value)}
                  placeholder="# System Architecture..."
                  className="w-full font-mono text-xs rounded-xl border border-border p-4 focus:border-foreground focus:outline-none bg-background text-foreground leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 5: design.md */}
            {activeTab === 'design' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-foreground">
                    design.md Content
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Markdown format
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={design}
                  onChange={e => setDesign(e.target.value)}
                  placeholder="# Design System Specifications..."
                  className="w-full font-mono text-xs rounded-xl border border-border p-4 focus:border-foreground focus:outline-none bg-background text-foreground leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}

            {/* TAB 6: executionPlan.md */}
            {activeTab === 'plan' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-foreground">
                    executionPlan.md Content
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Markdown format
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={executionPlan}
                  onChange={e => setExecutionPlan(e.target.value)}
                  placeholder="# Agentic IDE Execution Plan..."
                  className="w-full font-mono text-xs rounded-xl border border-border p-4 focus:border-foreground focus:outline-none bg-background text-foreground leading-relaxed"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-border p-4 bg-muted/40">
            <div className="text-[11px] text-muted-foreground">
              All changes are synced live to the database.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shadow-xs cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
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
