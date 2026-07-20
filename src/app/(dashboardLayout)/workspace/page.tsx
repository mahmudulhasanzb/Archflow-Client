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
} from 'lucide-react';

interface Blueprint {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function WorkspacePage() {
  const { data: session } = authClient.useSession();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    b => b.status === 'Generating',
  ).length;
  const readyBlueprints = blueprints.filter(b => b.status === 'Ready').length;

  return (
    <div className="flex-1 p-8 space-y-8">
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
            href="/blueprints/add"
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
            href="/blueprints/manage"
            className="block text-center rounded-lg bg-[#0D9488] py-2.5 text-sm font-semibold text-white hover:bg-[#0b7d72] transition-colors"
          >
            Open Status Tracker
          </Link>
        </div>
      </div>
    </div>
  );
}
