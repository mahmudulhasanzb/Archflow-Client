'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
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
  ArrowRight,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBlueprintsByUserEmail, getUserQuota } from '@/lib/api/blueprint/data';
import PaginationControls from '@/components/Pagination';

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
  complexcity?: string;
  complexity?: string;
  visibility?: 'public' | 'private';
  status: string;
  createdAt?: string;
  markdownFiles?: MarkdownFiles;
}

export default function ManageBlueprintsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPro, setIsPro] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(
    null,
  );
  const [modalLoading, setModalLoading] = useState(false);

  const fetchMyBlueprints = useCallback(async (query: string = '') => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const [userData, quotaData] = await Promise.all([
        getBlueprintsByUserEmail(userEmail, query),
        getUserQuota(userEmail),
      ]);
      if (userData) {
        const sorted = [...userData].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (dateB !== dateA) return dateB - dateA;
          return b._id.localeCompare(a._id);
        });
        setBlueprints(sorted);
      }
      const proUser =
        quotaData?.isPro ||
        (session?.user as any)?.role?.toLowerCase() === 'pro' ||
        (session?.user as any)?.role?.toLowerCase() === 'admin' ||
        (session?.user as any)?.plan?.toLowerCase() === 'pro';
      setIsPro(Boolean(proUser));
    } catch (err) {
      console.error('Error fetching own blueprints:', err);
      toast.error('Failed to load blueprints.');
    } finally {
      setLoading(false);
    }
  }, [userEmail, session]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userEmail) {
        fetchMyBlueprints(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userEmail, searchQuery, fetchMyBlueprints]);

  // Handle Edit Action Click
  const handleEditClick = (bp: Blueprint) => {
    if (!isPro) {
      toast.error('Editing blueprints is exclusive to Pro members. Upgrade to unlock full blueprint editing.', {
        icon: '🔒',
        duration: 4000,
      });
      return;
    }
    setSelectedBlueprint(bp);
    setIsEditOpen(true);
  };

  // Handle Save Edit Submit
  const handleSaveEdit = async (updatedFields: Partial<Blueprint>) => {
    if (!selectedBlueprint) return;
    setModalLoading(true);
    try {
      const res = await serverMutation(
        `/api/blueprints/${selectedBlueprint._id}`,
        'PATCH',
        updatedFields,
      );
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
      const res = await serverMutation(
        `/api/my-blueprints/${selectedBlueprint._id}`,
        'DELETE',
        {},
      );
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
        <h2 className="text-xl font-bold text-[#181B20] font-display">
          Authentication Required
        </h2>
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
            Review, edit parameters, view detailed architectures, or clean up
            your projects.
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
            placeholder="Search blueprints by name or description..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-[#E1E4EA] pl-10 pr-4 py-2 text-xs focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Pro Member</span>
            </span>
          ) : (
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
              title="Upgrade to Developer Pro to unlock blueprint editing"
            >
              <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Free Plan • Upgrade to Edit</span>
            </Link>
          )}

          <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {blueprints.length} {blueprints.length === 1 ? 'Blueprint' : 'Blueprints'}
          </span>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm">
        {loading ? (
          /* Loading State */
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(idx => (
              <div
                key={idx}
                className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 animate-pulse"
              >
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : blueprints.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center max-w-sm mx-auto space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#181B20] font-display">
                No Blueprints Found
              </h3>
                <p className="text-xs text-[#6B7280]">
                {searchQuery
                  ? 'No matches found for your filter.'
                  : "You haven't generated any blueprints yet."}
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
                {blueprints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(bp => {
                  const stackList = Array.isArray(bp.teckStack)
                    ? bp.teckStack
                    : bp.teckStack
                      ? bp.teckStack.split(',')
                      : [];

                  const compValue = bp.complexity || bp.complexcity || 'Medium';

                  return (
                    <tr
                      key={bp._id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
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
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            compValue.toLowerCase() === 'high'
                              ? 'text-rose-600 bg-rose-50 border border-rose-200/30'
                              : compValue.toLowerCase() === 'medium'
                                ? 'text-amber-600 bg-amber-50 border border-amber-200/30'
                                : 'text-emerald-600 bg-emerald-50 border border-emerald-200/30'
                          }`}
                        >
                          {compValue}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold ${
                            bp.status.toLowerCase() === 'ready'
                              ? 'text-emerald-700 bg-emerald-50'
                              : bp.status.toLowerCase() === 'generating'
                                ? 'text-blue-700 bg-blue-50 animate-pulse'
                                : 'text-rose-700 bg-rose-50'
                          }`}
                        >
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
                            disabled={!isPro}
                            className={`p-2 rounded-lg border transition-all duration-200 ${
                              isPro
                                ? 'border-[#E1E4EA] dark:border-[#222C43] text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-[#141A29] cursor-pointer'
                                : 'border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-900/30 cursor-not-allowed opacity-60'
                            }`}
                            title={
                              isPro
                                ? 'Edit Blueprint specifications (Pro feature)'
                                : 'Editing is locked on Free Tier. Upgrade to Pro to edit.'
                            }
                          >
                            {isPro ? (
                              <Edit2 className="h-3.5 w-3.5" />
                            ) : (
                              <Lock className="h-3.5 w-3.5" />
                            )}
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

            {/* Pagination Controls */}
            {Math.ceil(blueprints.length / itemsPerPage) > 1 && (
              <div className="p-4 border-t border-[#E1E4EA]">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(blueprints.length / itemsPerPage)}
                  onPageChange={page => setCurrentPage(page)}
                />
              </div>
            )}
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
