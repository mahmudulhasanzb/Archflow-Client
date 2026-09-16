'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { getBlueprintsByUserEmail, getUserQuota } from '@/lib/api/blueprint/data';
import {
  PlusCircle,
  FolderHeart,
  Sparkles,
  BookOpen,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Layers,
  ArrowRight,
  Zap,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface Blueprint {
  _id: string;
  title: string;
  description?: string;
  status: string;
  complexity?: string;
  complexcity?: string;
  teckStack?: string[] | string;
  createdAt: string;
}

interface QuotaData {
  role: string;
  plan?: string;
  isPro: boolean;
  count: number;
  max: number;
  remaining: number;
  canGenerate: boolean;
}

export default function WorkspacePage() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      if (!userEmail) return;
      setLoading(true);
      try {
        const [bpData, quotaData] = await Promise.all([
          getBlueprintsByUserEmail(userEmail),
          getUserQuota(userEmail),
        ]);
        if (bpData) setBlueprints(bpData);
        if (quotaData) setQuota(quotaData);
      } catch (err) {
        console.error('Failed to load workspace data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userEmail]);

  const isPro =
    quota?.isPro ||
    (session?.user as any)?.role?.toLowerCase() === 'pro' ||
    (session?.user as any)?.role?.toLowerCase() === 'admin';

  // 1. Blueprints Creation Over Time
  const getTimelineData = () => {
    if (blueprints.length === 0) {
      return [{ name: 'Today', count: 0 }];
    }

    const sorted = [...blueprints]
      .filter(bp => bp.createdAt)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const groups: { [key: string]: number } = {};
    sorted.forEach(bp => {
      const date = new Date(bp.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      groups[date] = (groups[date] || 0) + 1;
    });

    const list = Object.keys(groups).map(date => ({
      name: date,
      count: groups[date],
    }));

    return list.slice(-7);
  };

  // 2. Complexity Distribution
  const getComplexityData = () => {
    if (blueprints.length === 0) {
      return [
        { name: 'Low', count: 0, fill: '#10B981' },
        { name: 'Medium', count: 0, fill: '#F59E0B' },
        { name: 'High', count: 0, fill: '#EF4444' },
      ];
    }

    const counts = { low: 0, medium: 0, high: 0 };
    blueprints.forEach(bp => {
      const c = (bp.complexity || bp.complexcity || 'Medium').toLowerCase();
      if (c === 'low') counts.low++;
      else if (c === 'high') counts.high++;
      else counts.medium++;
    });

    return [
      { name: 'Low', count: counts.low, fill: '#10B981' },
      { name: 'Medium', count: counts.medium, fill: '#F59E0B' },
      { name: 'High', count: counts.high, fill: '#EF4444' },
    ];
  };

  const getTechStackString = (bp: Blueprint) => {
    if (Array.isArray(bp.teckStack)) {
      return bp.teckStack.join(', ');
    }
    return bp.teckStack || 'Next.js, Node.js';
  };

  return (
    <div className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
        <div aria-hidden className="absolute left-0 top-0 bottom-0 w-1 bg-foreground rounded-l-2xl" />

        <div className="relative space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
            Welcome back, {session?.user?.name || 'Architect'}!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Generate and manage your AI-engineered 5-file architecture suites.
          </p>
        </div>

        {/* Real Plan Badge */}
        <div className="relative flex items-center gap-2">
          {isPro ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3.5 py-1.5 text-xs font-bold text-foreground uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Pro Developer Active
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Free Tier
              </div>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                <Zap className="h-3 w-3" /> Upgrade
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Real Blueprints Count */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground font-display">
              {loading ? <span className="shimmer inline-block h-6 w-10 rounded" /> : blueprints.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
              My Blueprints
            </div>
          </div>
        </div>

        {/* Card 2: Real Quota Status */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground font-display">
              {loading ? (
                <span className="shimmer inline-block h-6 w-10 rounded" />
              ) : quota ? (
                `${quota.count} / ${quota.max}`
              ) : (
                '0 / 3'
              )}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
              {isPro ? 'Daily Quota Used' : 'Lifetime Quota Used'}
            </div>
          </div>
        </div>

        {/* Card 3: Total Markdown Specs Generated */}
        <div className="p-6 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground font-display">
              {loading ? <span className="shimmer inline-block h-6 w-10 rounded" /> : blueprints.length * 5}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
              Markdown Specs Ready
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 1: Activity */}
        <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <TrendingUp className="h-5 w-5 text-foreground" />
            <h3 className="font-bold text-sm text-foreground font-display">
              Generation Timeline
            </h3>
          </div>
          <div className="h-64 w-full text-xs">
            {mounted && !loading ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimelineData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6B7280" tickLine={false} />
                  <YAxis stroke="#6B7280" tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="var(--foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-muted rounded-lg animate-pulse" />
            )}
          </div>
        </div>

        {/* Chart 2: Complexity */}
        <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <BarChart2 className="h-5 w-5 text-foreground" />
            <h3 className="font-bold text-sm text-foreground font-display">
              Complexity Breakdown
            </h3>
          </div>
          <div className="h-64 w-full text-xs">
            {mounted && !loading ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getComplexityData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B7280" tickLine={false} />
                  <YAxis stroke="#6B7280" tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {getComplexityData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-muted rounded-lg animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Recent Blueprints Table Section */}
      <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-sm text-foreground font-display flex items-center gap-2">
            <Layers className="h-5 w-5 text-foreground" />
            Recent Architecture Blueprints
          </h3>
          <Link
            href="/manage-blueprints"
            className="text-xs font-semibold text-foreground hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          ) : blueprints.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No blueprints created yet. Click below to start your first architecture generation.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3">Blueprint Title</th>
                  <th className="px-6 py-3">Tech Stack</th>
                  <th className="px-6 py-3">Complexity</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {blueprints.slice(0, 6).map(bp => {
                  const complexityValue = bp.complexity || bp.complexcity || 'Medium';

                  return (
                    <tr key={bp._id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {bp.title}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-[220px] truncate">
                        {getTechStackString(bp)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            complexityValue.toLowerCase() === 'high'
                              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                              : complexityValue.toLowerCase() === 'medium'
                              ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                              : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                          }`}
                        >
                          {complexityValue}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/blueprints/${bp._id}`}
                          className="text-foreground hover:underline font-semibold cursor-pointer"
                        >
                          View 5 Specs
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border bg-card rounded-2xl p-6 sm:p-8 space-y-4 flex flex-col justify-between hover:border-foreground/30 transition-all">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-display">
              Create New Architecture Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Describe your software concept and generate a deterministic 5-file architecture suite ready for Agentic IDE coding.
            </p>
          </div>
          <Link
            href="/add-blueprint"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start Generator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="border border-border bg-card rounded-2xl p-6 sm:p-8 space-y-4 flex flex-col justify-between hover:border-foreground/30 transition-all">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground">
              <FolderHeart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-display">
              Manage & Export Blueprints
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Search your saved architecture specifications, copy markdown files, or download complete .ZIP project bundles.
            </p>
          </div>
          <Link
            href="/manage-blueprints"
            className="flex items-center justify-center gap-2 rounded-xl bg-card border border-border py-2.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
          >
            Manage Specifications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
