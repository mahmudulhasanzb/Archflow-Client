'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { serverFetch } from '@/lib/api/server';
import { serverMutation } from '@/lib/api/mutation';
import EditModal from '@/components/EditModal';
import DeleteModal from '@/components/DeleteModal';
import { 
  FolderHeart, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Search, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Blueprint {
  _id: string;
  title: string;
  description: string;
  teckStack?: string | string[];
  complexcity?: string;
  complexity?: string;
  status: string;
  createdAt?: string;
}

export default function ManageBlueprintsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchMyBlueprints = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const data = await serverFetch(`/api/my-blueprints/${session.user.email}`);
      if (data) {
        const sorted = [...data].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (dateB !== dateA) return dateB - dateA;
          return b._id.localeCompare(a._id);
        });
        setBlueprints(sorted);
      }
    } catch (err) {
      console.error('Error fetching own blueprints:', err);
      toast.error('Failed to load blueprints.');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBlueprints();
    }
  }, [session, fetchMyBlueprints]);

  // Handle Edit Action Click
  const handleEditClick = (bp: Blueprint) => {
    setSelectedBlueprint(bp);
    setIsEditOpen(true);
  };

  // Handle Save Edit Submit
  const handleSaveEdit = async (updatedFields: Partial<Blueprint>) => {
    if (!selectedBlueprint) return;
    setModalLoading(true);
    try {
      const res = await serverMutation(`/api/blueprints/${selectedBlueprint._id}`, 'PATCH', updatedFields);
      if (res) {
        toast.success('Blueprint updated successfully!');
        setIsEditOpen(false);
        fetchMyBlueprints();
      } else {
        throw new Error('Save failed');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update blueprint.');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Delete Action Click
  const handleDeleteClick = (bp: Blueprint) => {
    setSelectedBlueprint(bp);
    setIsDeleteOpen(true);
  };

  // Handle Confirm Delete Submit
  const handleConfirmDelete = async () => {
    if (!selectedBlueprint) return;
    setModalLoading(true);
    try {
      const res = await serverMutation(`/api/my-blueprints/${selectedBlueprint._id}`, 'DELETE', {});
      if (res) {
        toast.success('Blueprint permanently deleted.');
        setIsDeleteOpen(false);
        fetchMyBlueprints();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete blueprint.');
    } finally {
      setModalLoading(false);
    }
  };

  // Filtered list
  const filteredBlueprints = blueprints.filter((bp) =>
    bp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sessionPending) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="p-4 bg-rose-50 rounded-full text-rose-600 mb-4">
          <FolderHeart className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-[#181B20] font-display">Authentication Required</h2>
        <p className="text-sm text-[#6B7280] mt-2 mb-6">
          Please log in to manage your custom software architecture blueprints.
        </p>
        <Link
          href="/signin"
          className="rounded-lg bg-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3f37c9] transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="rounded-xl border border-[#E1E4EA] bg-white p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#181B20] font-display flex items-center gap-2">
            <FolderHeart className="h-6 w-6 text-[#0D9488]" />
            Manage My Blueprints
          </h1>
          <p className="text-sm text-[#6B7280]">
            Review, edit parameters, view detailed architectures, or clean up your projects.
          </p>
        </div>

        <Link
          href="/add-blueprint"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3f37c9] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Blueprint
        </Link>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Filter blueprints by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#E1E4EA] pl-10 pr-4 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
          />
        </div>

        <div className="text-xs text-[#6B7280] font-semibold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Active user: <span className="text-slate-900 font-bold">{session.user.email}</span></span>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm">
        {loading ? (
          /* Loading State */
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 animate-pulse">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredBlueprints.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center max-w-sm mx-auto space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#181B20] font-display">No Blueprints Found</h3>
              <p className="text-xs text-[#6B7280]">
                {searchQuery ? "No matches found for your filter." : "You haven't generated any blueprints yet."}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/add-blueprint"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 text-xs font-semibold text-[#181B20] hover:bg-[#FAFBFC] transition-colors mt-2"
              >
                Create your first blueprint <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-[#E1E4EA] text-[10px] font-bold uppercase tracking-wider text-[#181B20]">
                  <th className="py-4 px-6">Blueprint Info</th>
                  <th className="py-4 px-6">Tech Stack</th>
                  <th className="py-4 px-6">Complexity</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E4EA]">
                {filteredBlueprints.map((bp) => {
                  const stackList = Array.isArray(bp.teckStack)
                    ? bp.teckStack
                    : bp.teckStack ? bp.teckStack.split(',') : [];

                  const compValue = bp.complexity || bp.complexcity || 'Medium';

                  return (
                    <tr key={bp._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-[#181B20] font-display line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
                            {bp.title}
                          </h4>
                          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                            {bp.description}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {stackList.slice(0, 3).map((tech, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 border border-slate-200/40"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                          {stackList.length > 3 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 font-bold text-[#4F46E5]">
                              +{stackList.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          compValue.toLowerCase() === 'high' 
                            ? 'text-rose-600 bg-rose-50 border border-rose-200/30' 
                            : compValue.toLowerCase() === 'medium'
                            ? 'text-amber-600 bg-amber-50 border border-amber-200/30'
                            : 'text-emerald-600 bg-emerald-50 border border-emerald-200/30'
                        }`}>
                          {compValue}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold ${
                          bp.status.toLowerCase() === 'ready'
                            ? 'text-emerald-700 bg-emerald-50'
                            : bp.status.toLowerCase() === 'generating'
                            ? 'text-blue-700 bg-blue-50 animate-pulse'
                            : 'text-rose-700 bg-rose-50'
                        }`}>
                          {bp.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* View details */}
                          <Link
                            href={`/blueprints/${bp._id}`}
                            className="p-2 rounded-lg border border-[#E1E4EA] text-slate-500 hover:text-[#4F46E5] hover:border-[#4F46E5]/40 hover:bg-white transition-all duration-200"
                            title="View Architecture Flow"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Edit button */}
                          <button
                            onClick={() => handleEditClick(bp)}
                            className="p-2 rounded-lg border border-[#E1E4EA] text-slate-500 hover:text-emerald-600 hover:border-emerald-500/40 hover:bg-white transition-all duration-200"
                            title="Edit Blueprint parameters"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteClick(bp)}
                            className="p-2 rounded-lg border border-[#E1E4EA] text-slate-500 hover:text-rose-600 hover:border-rose-500/40 hover:bg-white transition-all duration-200"
                            title="Delete Blueprint record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal Component */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        blueprint={selectedBlueprint}
        onSave={handleSaveEdit}
        loading={modalLoading}
      />

      {/* Delete Modal Component */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        blueprintTitle={selectedBlueprint?.title || ''}
        onConfirm={handleConfirmDelete}
        loading={modalLoading}
      />
    </div>
  );
}
