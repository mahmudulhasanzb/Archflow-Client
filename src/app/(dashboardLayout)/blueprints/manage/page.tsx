'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { baseURL } from '@/lib/api/baseUrl';
import toast from 'react-hot-toast';
import { Trash2, ExternalLink, RefreshCw, Layers } from 'lucide-react';

interface Blueprint {
  _id: string;
  title: string;
  shortDescription?: string;
  stack: string;
  complexity?: string;
  status: string;
  currentStep: string;
  createdAt: string;
}

export default function ManageBlueprintsPage() {
  const { data: session } = authClient.useSession();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlueprints = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`${baseURL}/api/blueprints?creatorId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBlueprints(data);
      }
    } catch (err) {
      console.error('Failed to load blueprints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlueprints();

    // Poll every 3 seconds if any blueprint is generating
    const interval = setInterval(() => {
      const hasGenerating = blueprints.some((bp) => bp.status === 'Generating');
      if (hasGenerating) {
        fetchBlueprints();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [session, blueprints]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blueprint?')) return;
    const toastId = toast.loading('Deleting blueprint...');

    try {
      const res = await fetch(`${baseURL}/api/blueprints/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete blueprint.');
      }

      toast.success('Blueprint deleted successfully!', { id: toastId });
      // Remove from state
      setBlueprints((prev) => prev.filter((bp) => bp._id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Error occurred during deletion.', { id: toastId });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Ready') return 'bg-[#E6F5F3] text-[#0D9488] border-[#A8E0D7]';
    return 'bg-[#FFF0EA] text-[#EA5C34] border-[#FFD9CD] animate-pulse';
  };

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#181B20] font-display">My Blueprints</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track active simulations and review generated technical stubs.
          </p>
        </div>
        <button
          onClick={fetchBlueprints}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Main Table/Grid */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-white rounded-lg border border-[#E1E4EA]" />
          <div className="h-20 bg-white rounded-lg border border-[#E1E4EA]" />
          <div className="h-20 bg-white rounded-lg border border-[#E1E4EA]" />
        </div>
      ) : blueprints.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[#E1E4EA]">
          <Layers className="mx-auto h-12 w-12 text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold text-[#181B20] font-display">No blueprints created yet</h3>
          <p className="text-sm text-[#6B7280] mt-1">Generate a new software architecture spec to get started.</p>
          <Link
            href="/blueprints/add"
            className="mt-6 inline-flex items-center rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3f37c9] transition-colors"
          >
            Create First Blueprint
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#6B7280]">
              <thead className="bg-[#FAFBFC] border-b border-[#E1E4EA] text-xs font-semibold text-[#181B20] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Blueprint Details</th>
                  <th className="px-6 py-4">Target Stack</th>
                  <th className="px-6 py-4">Current Pipeline Step</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E4EA]">
                {blueprints.map((bp) => (
                  <tr key={bp._id} className="hover:bg-[#F1F3F6]/30 transition-colors">
                    {/* Details */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-bold text-[#181B20] font-display text-sm">{bp.title}</div>
                      <div className="text-xs text-[#6B7280] max-w-sm line-clamp-1">
                        {bp.shortDescription || 'No description provided.'}
                      </div>
                    </td>
                    
                    {/* Stack */}
                    <td className="px-6 py-4 text-xs font-semibold text-[#181B20]">
                      {bp.stack}
                    </td>

                    {/* Step */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#181B20] font-semibold">
                        {bp.currentStep}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeClass(bp.status)}`}>
                        {bp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/blueprints/${bp._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1E4EA] px-3 py-1.5 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(bp._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFD9CD] px-3 py-1.5 text-xs font-semibold text-[#EA5C34] hover:bg-[#FFF0EA] transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
