'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { serverMutation } from '@/lib/api/mutation';
import { getUserQuota } from '@/lib/api/blueprint/data';
import {
  generateProjectOverview,
  generateRequirements,
  generateArchitecture,
  generateDesign,
  generateExecutionPlan,
  extractBlueprintMetadata,
  GeneratedBlueprintFiles,
} from '@/lib/api/blueprintGenerator';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Layers,
  Lock,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  FileText,
  Code2,
  Palette,
  ListTodo,
  Zap,
  ArrowRight,
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

interface StarterTemplate {
  label: string;
  badge: string;
  prompt: string;
  techStack: string;
  exclusions: string;
  complexity: string;
}

const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    label: 'SaaS Subscription Platform',
    badge: 'SaaS',
    prompt:
      'Build a multi-tenant B2B SaaS platform with team workspaces, Stripe billing, granular user role permissions, audit logging, and modern analytics dashboards.',
    techStack:
      'Next.js 16, Tailwind CSS v4, Express 5, MongoDB, Stripe, Secure Session Auth',
    exclusions: 'No heavy Redux/Zustand, no Mongoose schemas, no Prisma ORM',
    complexity: 'medium',
  },
  {
    label: 'AI Agent Execution Engine',
    badge: 'AI Swarm',
    prompt:
      'Build an autonomous multi-agent task runner where users define high-level goals, and orchestrator agents decompose tasks into sub-tasks executed by specialized worker agents with live telemetry streaming.',
    techStack:
      'Next.js 16, TypeScript, Tailwind CSS v4, OpenRouter, Node.js, MongoDB',
    exclusions:
      'No Python dependencies, no LangChain abstractions, pure deterministic TypeScript',
    complexity: 'high',
  },
  {
    label: 'E-Commerce Marketplace',
    badge: 'Store',
    prompt:
      'Build a high-performance multi-vendor marketplace with product discovery, cart state, merchant storefronts, Stripe split payouts, and automated customer order notifications.',
    techStack:
      'Next.js 16 App Router, Tailwind CSS v4, Express 5, MongoDB, Stripe',
    exclusions:
      'No GraphQL, no microservices overhead, clean single-file backend',
    complexity: 'medium',
  },
  {
    label: 'Developer Productivity Hub',
    badge: 'Dev Tool',
    prompt:
      'Build an interactive developer dashboard for tracking GitHub PR reviews, CI/CD deployment pipelines, code snippets, and automated daily changelog generation.',
    techStack:
      'Next.js 16, Tailwind CSS, Secure Auth, Express 5, Native MongoDB Driver',
    exclusions: 'No complex Docker setup for MVP, client-side caching only',
    complexity: 'low',
  },
];

const TECH_TAG_SUGGESTIONS = [
  'Next.js 16',
  'Tailwind CSS v4',
  'TypeScript',
  'Node.js',
  'Express 5',
  'MongoDB',
  'PostgreSQL',
  'Prisma',
  'Supabase',
  'Stripe',
  'Redis',
];

const EXCLUSION_SUGGESTIONS = [
  'No Microservices',
  'No Heavy Docker',
  'No Redux',
  'Zero Python',
  'No GraphQL',
  'No Prisma ORM',
];

interface StepState {
  id: number;
  name: string;
  file: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'waiting' | 'generating' | 'completed';
}

export default function AddBlueprintPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;

  // Form states
  const [prompt, setPrompt] = useState('');
  const [techStackInput, setTechStackInput] = useState(
    'Next.js 16, Tailwind CSS v4, Express 5, MongoDB',
  );
  const [exclusions, setExclusions] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  // Quota & Tier State
  const [quota, setQuota] = useState<{
    role: string;
    count: number;
    max: number;
    remaining: number;
    canGenerate: boolean;
    isPro: boolean;
  } | null>(null);
  const [loadingQuota, setLoadingQuota] = useState(true);
  const [upgradingStripe, setUpgradingStripe] = useState(false);

  const quotaUsed = quota?.count || 0;
  const quotaMax = quota?.max || 3;
  const quotaPercentage = Math.min(
    100,
    Math.round((quotaUsed / quotaMax) * 100),
  );

  // Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<StepState[]>([
    {
      id: 1,
      name: 'Project Overview',
      file: 'projectOverview.md',
      icon: FileText,
      status: 'waiting',
    },
    {
      id: 2,
      name: 'System Requirements',
      file: 'requirements.md',
      icon: ListTodo,
      status: 'waiting',
    },
    {
      id: 3,
      name: 'Architecture & Schemas',
      file: 'architecture.md',
      icon: Code2,
      status: 'waiting',
    },
    {
      id: 4,
      name: 'Design System & UI',
      file: 'design.md',
      icon: Palette,
      status: 'waiting',
    },
    {
      id: 5,
      name: 'Agentic Execution Plan',
      file: 'executionPlan.md',
      icon: CheckCircle2,
      status: 'waiting',
    },
  ]);

  // Load quota status on mount
  useEffect(() => {
    async function loadQuota() {
      if (!userEmail) return;
      try {
        setLoadingQuota(true);
        const data = await getUserQuota(userEmail);
        setQuota(data);
        if (data && !data.isPro) {
          setVisibility('public');
        }
      } catch (err) {
        console.error('Error fetching quota in add-blueprint:', err);
      } finally {
        setLoadingQuota(false);
      }
    }
    loadQuota();
  }, [userEmail]);

  // Handle Stripe Upgrade Redirect
  const handleUpgradeClick = async () => {
    const toastId = toast.loading('Initiating secure Stripe payment...');
    try {
      setUpgradingStripe(true);
      const res = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: 'month' }),
      });
      const data = await res.json();
      if (data.url) {
        toast.success('Redirecting to Stripe...', { id: toastId });
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to start checkout', { id: toastId });
        setUpgradingStripe(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Payment checkout failed', { id: toastId });
      setUpgradingStripe(false);
    }
  };

  // Select starter template
  const applyTemplate = (t: StarterTemplate) => {
    setActiveTemplate(t.label);
    setPrompt(t.prompt);
    setTechStackInput(t.techStack);
    setExclusions(t.exclusions);
    setComplexity(t.complexity);
    toast.success(`Applied "${t.label}" template`);
  };

  // Toggle quick tag in Tech Stack input
  const toggleTechTag = (tag: string) => {
    const current = techStackInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    let updated: string[];
    if (current.some(item => item.toLowerCase() === tag.toLowerCase())) {
      updated = current.filter(
        item => item.toLowerCase() !== tag.toLowerCase(),
      );
    } else {
      updated = [...current, tag];
    }
    setTechStackInput(updated.join(', '));
  };

  // Toggle quick tag in Scope Exclusions input
  const toggleExclusionTag = (tag: string) => {
    const current = exclusions
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    let updated: string[];
    if (current.some(item => item.toLowerCase() === tag.toLowerCase())) {
      updated = current.filter(
        item => item.toLowerCase() !== tag.toLowerCase(),
      );
    } else {
      updated = [...current, tag];
    }
    setExclusions(updated.join(', '));
  };

  const updateStepStatus = (
    stepId: number,
    status: 'waiting' | 'generating' | 'completed',
  ) => {
    setSteps(prev => prev.map(s => (s.id === stepId ? { ...s, status } : s)));
  };

  // Main 5-Step Generator Execution
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error('Please enter a project description or requirements prompt.');
      return;
    }

    if (quota && !quota.canGenerate) {
      toast.error(
        `Blueprint limit reached (${quota.count}/${quota.max}). Upgrade to Pro to continue.`,
      );
      return;
    }

    const techStack = techStackInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    setIsGenerating(true);
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'waiting' })));

    try {
      // Step 1: Project Overview
      updateStepStatus(1, 'generating');
      const projectOverview = await generateProjectOverview({
        prompt,
        techStack,
        exclusions,
        complexity,
      });
      updateStepStatus(1, 'completed');

      // Step 2: Requirements Specification
      updateStepStatus(2, 'generating');
      const requirements = await generateRequirements(
        { prompt, exclusions, complexity },
        projectOverview,
      );
      updateStepStatus(2, 'completed');

      // Step 3: Architecture & Schemas
      updateStepStatus(3, 'generating');
      const architecture = await generateArchitecture(
        { prompt, techStack },
        projectOverview,
        requirements,
      );
      updateStepStatus(3, 'completed');

      // Step 4: Design System & UI
      updateStepStatus(4, 'generating');
      const design = await generateDesign(
        { prompt, techStack },
        projectOverview,
        architecture,
      );
      updateStepStatus(4, 'completed');

      // Step 5: Agentic Execution Plan
      updateStepStatus(5, 'generating');
      const executionPlan = await generateExecutionPlan(
        { prompt, techStack, exclusions, complexity },
        projectOverview,
        requirements,
        architecture,
        design,
      );
      updateStepStatus(5, 'completed');

      const markdownFiles: GeneratedBlueprintFiles = {
        projectOverview,
        requirements,
        architecture,
        design,
        executionPlan,
      };

      const metadata = await extractBlueprintMetadata(
        projectOverview,
        'New Software Blueprint',
      );

      // Save to MongoDB via Express Backend
      const payload = {
        title: metadata.title,
        description: metadata.description,
        prompt,
        teckStack: techStack.length
          ? techStack
          : ['Next.js', 'Express', 'MongoDB'],
        complexcity: complexity,
        visibility,
        markdownFiles,
        architectureFlow: {
          architecture: {
            title: 'System Architecture',
            description: architecture.slice(0, 320) + '...',
          },
          features: {
            title: 'Requirements & Scope',
            description: requirements.slice(0, 320) + '...',
          },
          plan: {
            title: 'Execution Roadmap',
            description: executionPlan.slice(0, 320) + '...',
          },
        },
        status: 'ready',
        rating: 5,
        author: userEmail,
        email: userEmail,
        creatorId: session?.user?.id || '',
        createdAt: new Date().toISOString(),
      };

      const res = await serverMutation('/api/blueprints', 'POST', payload);

      if (res && (res.insertedId || res._id || res.blueprintId)) {
        const id = res.insertedId || res._id || res.blueprintId;
        toast.success('Blueprint generated successfully!');
        router.push(`/blueprints/${id}`);
      } else if (res?.error) {
        throw new Error(res.error);
      } else {
        throw new Error('Server did not return a valid blueprint ID');
      }
    } catch (err: any) {
      console.error('Generation failure:', err);
      toast.error(
        err.message || 'Blueprint generation failed. Please try again.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8 flex-grow">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              AI Blueprint Studio
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-0.5 text-[11px] font-bold text-foreground uppercase tracking-wide">
              <Sparkles className="h-3 w-3" /> MVP Generator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Generate 5 deterministic, Agentic-IDE-ready markdown specifications
            with checkable phased tasks.
          </p>
        </div>

        {/* Quota Badge Header */}
        <div className="flex items-center gap-3">
          {loadingQuota ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking quota...
            </div>
          ) : quota ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card shadow-2xs min-w-[200px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                    {quota.isPro ? (
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {quota.isPro ? 'Pro' : 'Free'}
                  </span>
                  <span className="font-bold text-foreground text-[11px]">
                    {quota.remaining} of {quota.max} left
                  </span>
                </div>
                {/* Visual progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/40">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      quotaPercentage >= 100
                        ? 'bg-rose-500'
                        : quotaPercentage >= 66
                          ? 'bg-amber-500'
                          : 'bg-primary'
                    }`}
                    style={{ width: `${quotaPercentage}%` }}
                  />
                </div>
              </div>

              {!quota.isPro && (
                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  disabled={upgradingStripe}
                  className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
                >
                  {upgradingStripe ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      Upgrade
                      <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Quota Limit Reached Warning Banner */}
      {quota && !quota.canGenerate && (
        <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-destructive flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm">
              Generation Quota Limit Reached
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              You have created {quota.count} of {quota.max} blueprints allowed
              on the Free plan. Upgrade to Pro for 10 daily blueprints
              and private workspaces.
            </p>
          </div>
          <button
            onClick={handleUpgradeClick}
            disabled={upgradingStripe}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            {upgradingStripe ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5 fill-current" />
            )}
            Upgrade to Pro ($29/mo)
          </button>
        </div>
      )}

      {/* Starter Templates Carousel / Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
            1-Click Starter Prompts
          </span>
          <span className="text-[11px] text-muted-foreground">
            Click any template to autopopulate
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STARTER_TEMPLATES.map((tpl, i) => {
            const isSelected = activeTemplate === tpl.label;
            return (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(tpl)}
                disabled={isGenerating}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer group disabled:opacity-50 relative ${
                  isSelected
                    ? 'border-primary ring-1 ring-primary/40 bg-primary/5 shadow-xs'
                    : 'border-border bg-card hover:border-foreground/40 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                    {tpl.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                      {tpl.complexity}
                    </span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:underline transition-all line-clamp-1">
                  {tpl.label}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {tpl.prompt}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Generator Form & Live Stepper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            {/* Project Requirements Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Project Prompt & Requirements{' '}
                  <span className="text-destructive">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Paste any prompt, notes, or discovery specs
                </span>
              </div>
              <textarea
                required
                rows={5}
                disabled={isGenerating}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Example: Build a B2B project management platform with real-time kanban boards, role permissions, activity audit logs, and Stripe billing. Include user stories and folder architecture..."
                className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-all font-sans leading-relaxed resize-y disabled:opacity-60"
              />
            </div>

            {/* Tech Stack Preferences */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Tech Stack Preferences
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Comma-separated
                </span>
              </div>
              <input
                type="text"
                disabled={isGenerating}
                value={techStackInput}
                onChange={e => setTechStackInput(e.target.value)}
                placeholder="e.g. Next.js 16, Tailwind CSS v4, Express 5, MongoDB, Stripe"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-all disabled:opacity-60"
              />
              {/* Quick Tech Tag Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                  Quick Add:
                </span>
                {TECH_TAG_SUGGESTIONS.map(tag => {
                  const isSelected = techStackInput
                    .toLowerCase()
                    .split(',')
                    .map(s => s.trim())
                    .includes(tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => toggleTechTag(tag)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
                        isSelected
                          ? 'bg-foreground text-background border-foreground font-semibold'
                          : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border'
                      }`}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scope Exclusions (What NOT to build) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Scope Exclusions (What NOT to build)
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Optional boundaries
                </span>
              </div>
              <input
                type="text"
                disabled={isGenerating}
                value={exclusions}
                onChange={e => setExclusions(e.target.value)}
                placeholder="e.g. No microservices, no Redux, no Mongoose, no heavy Docker orchestration"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-all disabled:opacity-60"
              />
              {/* Quick Exclusion Tag Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                  Quick Boundaries:
                </span>
                {EXCLUSION_SUGGESTIONS.map(tag => {
                  const isSelected = exclusions
                    .toLowerCase()
                    .split(',')
                    .map(s => s.trim())
                    .includes(tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => toggleExclusionTag(tag)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
                        isSelected
                          ? 'bg-foreground text-background border-foreground font-semibold'
                          : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border'
                      }`}
                    >
                      {isSelected ? `- ${tag}` : `- ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Settings Row: Complexity & Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Complexity */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                  Target Complexity
                </label>
                <CustomSelect
                  disabled={isGenerating}
                  value={complexity}
                  onChange={setComplexity}
                  triggerClassName="bg-background"
                  options={[
                    {
                      value: 'low',
                      label: 'Low Complexity',
                      badge: 'MVP',
                      description:
                        'Minimal viable prototype & quick proof-of-concept',
                    },
                    {
                      value: 'medium',
                      label: 'Medium Complexity',
                      badge: 'STANDARD',
                      description:
                        'Standard full-stack product with auth & database',
                    },
                    {
                      value: 'high',
                      label: 'High Complexity',
                      badge: 'ENTERPRISE',
                      description:
                        'Enterprise-grade multi-tier & distributed scale',
                    },
                  ]}
                />
              </div>

              {/* Visibility (Role Gated) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Blueprint Visibility
                  </label>
                  {!quota?.isPro && (
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> Private is Pro
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => setVisibility('public')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer ${
                      visibility === 'public'
                        ? 'border-foreground bg-muted text-foreground font-bold'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" /> Public
                  </button>

                  <button
                    type="button"
                    disabled={isGenerating || !quota?.isPro}
                    onClick={() => {
                      if (quota?.isPro) {
                        setVisibility('private');
                      } else {
                        toast.error(
                          'Upgrade to Pro to create private blueprints.',
                        );
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer ${
                      visibility === 'private'
                        ? 'border-foreground bg-muted text-foreground font-bold'
                        : !quota?.isPro
                          ? 'border-dashed border-border opacity-50 text-muted-foreground cursor-not-allowed'
                          : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" /> Private
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action CTA */}
            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                disabled={
                  isGenerating || (quota !== null && !quota.canGenerate)
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating 5-File Architecture Suite...
                  </>
                ) : quota && !quota.canGenerate ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Blueprint Quota Exhausted (Upgrade to Pro)
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Architecture & Execution Blueprint
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Right 1 Col: Live 5-Step Progress Stepper */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 min-w-0">
              <Layers className="h-3.5 w-3.5 text-foreground shrink-0" />
              <span className="truncate">Blueprint Pipeline</span>
            </h3>
            <span className="inline-flex items-center justify-center shrink-0 whitespace-nowrap text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-foreground border border-border">
              5 Files
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Archflow generates a deterministic 5-file suite optimized for direct
            prompt commands in Agentic IDEs (Cursor, Antigravity, Claude Code).
          </p>

          <div className="space-y-2.5 pt-2">
            {steps.map(step => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    step.status === 'completed'
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : step.status === 'generating'
                        ? 'border-foreground bg-muted shadow-xs animate-pulse'
                        : 'border-border bg-background opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 text-primary-foreground'
                          : step.status === 'generating'
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground line-clamp-1">
                        {step.name}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {step.file}
                      </div>
                    </div>
                  </div>

                  <div>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : step.status === 'generating' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* IDE Tip Box */}
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-[11px] text-muted-foreground space-y-1">
            <span className="font-bold text-foreground block">
              Agentic IDE Compatibility:
            </span>
            <span>
              Generated{' '}
              <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">
                executionPlan.md
              </code>{' '}
              uses strict <code className="font-mono">[ ]</code> syntax with
              explicit verification commands for AI coding assistants.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
