import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Star,
  CheckCircle2,
  Cpu,
  Layers,
  Layout,
  ShieldAlert,
  Tag,
  BarChart2,
  User,
} from 'lucide-react';
import { serverFetch } from '@/lib/api/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

const ACCENTS = [
  { color: '#4F46E5', soft: '#EEF0FF' },
  { color: '#0D9488', soft: '#E6F5F3' },
  { color: '#EA5C34', soft: '#FFF0EA' },
  { color: '#4F46E5', soft: '#EEF0FF' },
];
const ICONS = [Cpu, Layers, Layout, ShieldAlert];

function hashIndex(str: string, len: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % len;
  return hash;
}

const complexityStyle = (c: string) => {
  const v = (c || '').toLowerCase();
  if (v === 'high') return { badge: 'text-rose-600 bg-rose-50 border-rose-100', label: 'High' };
  if (v === 'medium') return { badge: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Medium' };
  return { badge: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Low' };
};

const statusStyle = (s: string) => {
  const v = (s || '').toLowerCase();
  if (v === 'ready' || v === 'completed')
    return 'text-emerald-700 bg-emerald-50 border-emerald-100';
  if (v === 'generating' || v === 'pending')
    return 'text-amber-700 bg-amber-50 border-amber-100';
  return 'text-[#6B7280] bg-[#F1F3F6] border-[#E1E4EA]';
};

export default async function BlueprintDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const blueprint = await serverFetch(`/api/blueprints/${resolvedParams.id}`);

  if (!blueprint) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <ShieldAlert className="h-8 w-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-[#181B20] font-display">Blueprint not found</h2>
        <p className="text-sm text-[#6B7280]">This blueprint may have been removed or the ID is invalid.</p>
        <Link
          href="/blueprints"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#4338CA] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  // Normalize fields
  const title = blueprint.title || 'Untitled Blueprint';
  const description = blueprint.description || '';
  const complexity = blueprint.complexity || blueprint.complexcity || 'Medium';
  const { badge: complexBadge, label: complexLabel } = complexityStyle(complexity);
  const status = blueprint.status || 'Ready';
  const rating = blueprint.rating ? Number(blueprint.rating).toFixed(1) : '4.5';
  const createdAt = blueprint.createdAt
    ? new Date(blueprint.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'N/A';

  const stackItems: string[] = Array.isArray(blueprint.teckStack)
    ? blueprint.teckStack
    : (blueprint.teckStack || blueprint.stack || 'Next.js').split(',').map((s: string) => s.trim());

  const idx = hashIndex(title, ICONS.length);
  const Icon = ICONS[idx];
  const { color, soft } = ACCENTS[idx];

  const archFlow = blueprint.architectureFlow;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex-grow space-y-8">
      {/* Back link */}
      <Link
        href="/blueprints"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#181B20] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
      </Link>

      {/* ── Hero card ─────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#E1E4EA] bg-white shadow-sm">
        {/* Gradient header banner */}
        <div
          className="flex h-40 items-center justify-center border-b border-[#E1E4EA]"
          style={{ background: `linear-gradient(135deg, ${soft} 0%, white 100%)` }}
        >
          <Icon className="h-16 w-16 opacity-80" style={{ color }} />
        </div>

        {/* Title + meta */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${complexBadge}`}
            >
              <BarChart2 className="h-3 w-3" />
              {complexLabel} Complexity
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(status)}`}
            >
              <CheckCircle2 className="h-3 w-3" />
              {status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#181B20] font-display leading-tight">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-3xl">
              {description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#6B7280] font-medium border-t border-[#E1E4EA]">
            <span className="flex items-center gap-1.5 pt-4">
              <Calendar className="h-4 w-4" />
              {createdAt}
            </span>
            <span className="flex items-center gap-1.5 pt-4">
              <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
              {rating} / 5.0
            </span>
            {blueprint.author && (
              <span className="flex items-center gap-1.5 pt-4">
                <User className="h-4 w-4" />
                {blueprint.author}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Tech Stack ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E1E4EA] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF0FF]">
            <Tag className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <h2 className="text-base font-bold text-[#181B20] font-display">Tech Stack</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {stackItems.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[#E1E4EA] bg-[#F1F3F6] px-3 py-1 text-xs font-semibold text-[#181B20]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── Architecture Flow ─────────────────────────────────── */}
      {archFlow && (
        <div className="rounded-2xl border border-[#E1E4EA] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F5F3]">
              <Layers className="h-4 w-4 text-[#0D9488]" />
            </div>
            <h2 className="text-base font-bold text-[#181B20] font-display">Architecture Flow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Architecture */}
            {archFlow.architecture && (
              <div className="rounded-xl border border-[#E1E4EA] bg-[#FAFBFC] p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF0FF]">
                  <Cpu className="h-4 w-4 text-[#4F46E5]" />
                </div>
                <h3 className="font-bold text-[#181B20] font-display text-sm">
                  {archFlow.architecture.title || 'Architecture'}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {archFlow.architecture.description || 'No details provided.'}
                </p>
              </div>
            )}

            {/* Features */}
            {archFlow.features && (
              <div className="rounded-xl border border-[#E1E4EA] bg-[#FAFBFC] p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F5F3]">
                  <Layout className="h-4 w-4 text-[#0D9488]" />
                </div>
                <h3 className="font-bold text-[#181B20] font-display text-sm">
                  {archFlow.features.title || 'Features'}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {archFlow.features.description || 'No details provided.'}
                </p>
              </div>
            )}

            {/* Plan */}
            {archFlow.plan && (
              <div className="rounded-xl border border-[#E1E4EA] bg-[#FAFBFC] p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0EA]">
                  <ShieldAlert className="h-4 w-4 text-[#EA5C34]" />
                </div>
                <h3 className="font-bold text-[#181B20] font-display text-sm">
                  {archFlow.plan.title || 'Implementation Plan'}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {archFlow.plan.description || 'No details provided.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom CTA strip ──────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E1E4EA] bg-gradient-to-r from-[#EEF0FF]/60 to-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#181B20] font-display">
            Want to build something similar?
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Run the AI pipeline to generate your own custom blueprint.
          </p>
        </div>
        <Link
          href="/add-blueprint"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] hover:shadow-[#4F46E5]/35 transition-all shrink-0"
        >
          Create Your Blueprint
        </Link>
      </div>
    </div>
  );
}
