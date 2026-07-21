'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { baseURL } from '@/lib/api/baseUrl';
import {
  PlusCircle,
  FolderHeart,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  ArrowRight,
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

export default function WorkspacePage() {
  const { data: session } = authClient.useSession();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `${baseURL}/api/blueprints?creatorId=${session.user.id}`,
        );
        if (res.ok) {
          const data = await res.json();
          setBlueprints(data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [session]);

  const activeGenerations = blueprints.filter(
    b => b.status?.toLowerCase() === 'generating' || b.status?.toLowerCase() === 'pending'
  ).length;
  
  const readyBlueprints = blueprints.filter(
    b => b.status?.toLowerCase() === 'ready' || b.status?.toLowerCase() === 'completed'
  ).length;

  // 1. Blueprints Creation Over Time
  const getTimelineData = () => {
    if (blueprints.length === 0) {
      return [
        { name: 'Week 1', count: 4 },
        { name: 'Week 2', count: 7 },
        { name: 'Week 3', count: 5 },
        { name: 'Week 4', count: 9 },
      ];
    }

    // Sort blueprints by date ascending
    const sorted = [...blueprints]
      .filter(bp => bp.createdAt)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Group by Date (limit to last 7 distinct dates for cleaner visual representation)
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

    return list.slice(-7); // take last 7 points
  };

  // 2. Complexity Distribution
  const getComplexityData = () => {
    const counts = { low: 0, medium: 0, high: 0 };
    blueprints.forEach(bp => {
      const comp = (bp.complexity || bp.complexcity || 'medium').toLowerCase();
      if (comp.includes('low')) counts.low++;
      else if (comp.includes('high')) counts.high++;
      else counts.medium++;
    });

    // If no blueprints, render standard dummy distribution for visualization
    if (blueprints.length === 0) {
      return [
        { name: 'Low', count: 2, fill: '#10B981' },
        { name: 'Medium', count: 5, fill: '#F59E0B' },
        { name: 'High', count: 3, fill: '#EF4444' },
      ];
    }

    return [
      { name: 'Low', count: counts.low, fill: '#10B981' },
      { name: 'Medium', count: counts.medium, fill: '#F59E0B' },
      { name: 'High', count: counts.high, fill: '#EF4444' },
    ];
  };

  // Get tech stack items list
  const getTechStackString = (bp: Blueprint) => {
    if (Array.isArray(bp.teckStack)) {
      return bp.teckStack.join(', ');
    }
    return bp.teckStack || 'React, Node.js';
  };

  return (
    <div className="flex-grow p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-[#181B20] font-display">
            Welcome back, {session?.user?.name || 'Developer'}!
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage your AI software architecture blueprints and start new
            generations.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3.5 py-1 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Pro Plan Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-[#E1E4EA] shadow-sm flex items-center gap-4">
          <div className="bg-[#EEF0FF] text-[#4F46E5] p-3 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#181B20] font-display">
              {loading ? '...' : blueprints.length}
            </div>
            <div className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
              Total Blueprints
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#E1E4EA] shadow-sm flex items-center gap-4">
          <div className="bg-[#FFF0EA] text-[#EA5C34] p-3 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#181B20] font-display">
              {loading ? '...' : activeGenerations}
            </div>
            <div className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
              Active Generations
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#E1E4EA] shadow-sm flex items-center gap-4">
          <div className="bg-[#E6F5F3] text-[#0D9488] p-3 rounded-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#181B20] font-display">
              {loading ? '...' : readyBlueprints}
            </div>
            <div className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
              Completed Ready
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 1: Blueprint creation activity */}
        <div className="border border-[#E1E4EA] bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E1E4EA] pb-3">
            <TrendingUp className="h-5 w-5 text-[#4F46E5]" />
            <h3 className="font-bold text-sm text-[#181B20] font-display">
              Generation Activity Over Time
            </h3>
          </div>
          <div className="h-64 w-full text-xs">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimelineData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6B7280" tickLine={false} />
                  <YAxis stroke="#6B7280" tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--surface, #FFFFFF)', 
                      borderColor: 'var(--border, #E1E4EA)',
                      color: 'var(--text, #181B20)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-[#F1F3F6]/50 rounded-lg animate-pulse" />
            )}
          </div>
        </div>

        {/* Chart 2: Architecture Complexity */}
        <div className="border border-[#E1E4EA] bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E1E4EA] pb-3">
            <BarChart2 className="h-5 w-5 text-[#0D9488]" />
            <h3 className="font-bold text-sm text-[#181B20] font-display">
              Complexity Distribution
            </h3>
          </div>
          <div className="h-64 w-full text-xs">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getComplexityData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B7280" tickLine={false} />
                  <YAxis stroke="#6B7280" tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: 'var(--surface, #FFFFFF)', 
                      borderColor: 'var(--border, #E1E4EA)',
                      color: 'var(--text, #181B20)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {getComplexityData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-[#F1F3F6]/50 rounded-lg animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Recent Blueprints Table Section */}
      <div className="border border-[#E1E4EA] bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E1E4EA] flex justify-between items-center bg-white">
          <h3 className="font-bold text-sm text-[#181B20] font-display flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#EA5C34]" />
            Recent Blueprint Configurations
          </h3>
          <Link
            href="/manage-blueprints"
            className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              <div className="h-6 bg-[#F1F3F6] rounded animate-pulse w-1/3" />
              <div className="h-10 bg-[#F1F3F6] rounded animate-pulse" />
              <div className="h-10 bg-[#F1F3F6] rounded animate-pulse" />
            </div>
          ) : blueprints.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280] text-sm">
              No blueprints created yet. Use the card below to build your first software architecture.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-[#E1E4EA] text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  <th className="px-6 py-3">Blueprint Title</th>
                  <th className="px-6 py-3">Tech Stack</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Complexity</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E4EA] text-xs">
                {blueprints.slice(0, 4).map(bp => {
                  const complexityValue = bp.complexity || bp.complexcity || 'Medium';
                  const statusValue = bp.status || 'Ready';
                  
                  return (
                    <tr key={bp._id} className="hover:bg-[#F1F3F6]/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#181B20]">
                        {bp.title}
                      </td>
                      <td className="px-6 py-4 text-[#6B7280] max-w-[200px] truncate">
                        {getTechStackString(bp)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          statusValue.toLowerCase() === 'ready' || statusValue.toLowerCase() === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : statusValue.toLowerCase() === 'generating' || statusValue.toLowerCase() === 'pending'
                            ? 'bg-amber-50 text-amber-700 animate-pulse'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {statusValue}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          complexityValue.toLowerCase() === 'high'
                            ? 'text-rose-600 bg-rose-50'
                            : complexityValue.toLowerCase() === 'medium'
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-emerald-600 bg-emerald-50'
                        }`}>
                          {complexityValue}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/blueprints/${bp._id}`}
                          className="text-[#4F46E5] hover:underline font-semibold"
                        >
                          View Config
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

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Card */}
        <div className="border border-[#E1E4EA] bg-white rounded-xl p-8 space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <PlusCircle className="h-10 w-10 text-[#4F46E5]" />
            <h3 className="text-lg font-bold text-[#181B20] font-display">
              Create New Blueprint
            </h3>
            <p className="text-sm text-[#6B7280]">
              Describe a software concept in a simple text paragraph and let our
              sequence of 4 AI agents build the database, roadmap, APIs, and
              audit check records.
            </p>
          </div>
          <Link
            href="/add-blueprint"
            className="block text-center rounded-lg bg-[#4F46E5] py-2.5 text-sm font-semibold text-white hover:bg-[#3f37c9] transition-colors"
          >
            Start Generator Form
          </Link>
        </div>

        {/* Manage Card */}
        <div className="border border-[#E1E4EA] bg-white rounded-xl p-8 space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <FolderHeart className="h-10 w-10 text-[#0D9488]" />
            <h3 className="text-lg font-bold text-[#181B20] font-display">
              Manage Active Projects
            </h3>
            <p className="text-sm text-[#6B7280]">
              Track the progress steps of generating stubs, view completed
              schema tables, download setup readmes, or delete older records.
            </p>
          </div>
          <Link
            href="/manage-blueprints"
            className="block text-center rounded-lg bg-[#0D9488] py-2.5 text-sm font-semibold text-white hover:bg-[#0b7d72] transition-colors"
          >
            Open Status Tracker
          </Link>
        </div>
      </div>
    </div>
  );
}
