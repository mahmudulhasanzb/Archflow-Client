'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Globe,
  ArrowUpDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBlueprintsByUserEmail, getUserQuota } from '@/lib/api/blueprint/data';
import PaginationControls from '@/components/Pagination';
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
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'complexity'>('newest');
  const [isPro, setIsPro] = useState<boolean>(false);

  // Filtered & Sorted Blueprints
  const processedBlueprints = useMemo(() => {
    let list = [...blueprints];
    if (visibilityFilter !== 'all') {
      list = list.filter(bp => (bp.visibility || 'public').toLowerCase() === visibilityFilter);
    }
    if (sortBy === 'oldest') {
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'complexity') {
      const weights: Record<string, number> = { high: 3, medium: 2, low: 1 };
      list.sort((a, b) => {
        const wA = weights[(a.complexity || a.complexcity || 'medium').toLowerCase()] || 0;
        const wB = weights[(b.complexity || b.complexcity || 'medium').toLowerCase()] || 0;
        return wB - wA;
      });
    } else {
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    return list;
  }, [blueprints, visibilityFilter, sortBy]);

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
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-4">
          <FolderHeart className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground font-display">
          Authentication Required
        </h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          Please log in to manage your custom software architecture blueprints.
        </p>
        <Link
          href="/signin"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display flex items-center gap-2">
            <FolderHeart className="h-6 w-6 text-foreground" />
            Manage My Blueprints
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, edit parameters, view detailed architectures, or clean up
            your projects.
          </p>
        </div>

        <Link
          href="/add-blueprint"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Blueprint
        </Link>
      </div>

      {/* Controls & Search */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blueprints by name or description..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border pl-10 pr-4 py-2 text-xs focus:border-foreground focus:outline-none bg-card text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Visibility Filter Custom Select */}
          <CustomSelect
            value={visibilityFilter}
            onChange={val => {
              setVisibilityFilter(val as any);
              setCurrentPage(1);
            }}
            icon={<Globe className="h-4 w-4" />}
            options={[
              { value: 'all', label: 'All Visibilities' },
              { value: 'public', label: 'Public Only', badge: 'GALLERY' },
              { value: 'private', label: 'Private Only', badge: 'WORKSPACE' },
            ]}
          />

          {/* Sort By Custom Select */}
          <CustomSelect
            value={sortBy}
            onChange={val => {
              setSortBy(val as any);
              setCurrentPage(1);
            }}
            icon={<ArrowUpDown className="h-4 w-4" />}
            options={[
              { value: 'newest', label: 'Sort: Newest First' },
              { value: 'oldest', label: 'Sort: Oldest First' },
              { value: 'title', label: 'Sort: Title (A-Z)' },
              { value: 'complexity', label: 'Sort: Complexity' },
            ]}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold px-2.5 py-1 rounded-full bg-muted border border-border text-[11px]">
            {processedBlueprints.length} {processedBlueprints.length === 1 ? 'Blueprint' : 'Blueprints'}
            {visibilityFilter !== 'all' && ` (${visibilityFilter})`}
          </span>

          {isPro ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground border border-border">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span>Pro Member</span>
            </span>
          ) : (
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border hover:text-foreground transition-colors"
              title="Upgrade to Developer Pro to unlock blueprint editing"
            >
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Free Plan • Upgrade to Edit</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          /* Loading State */
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(idx => (
              <div
                key={idx}
                className="flex items-center justify-between py-4 border-b border-border last:border-0 animate-pulse"
              >
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                </div>
                <div className="h-8 w-24 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : processedBlueprints.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center max-w-sm mx-auto space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground font-display">
                No Blueprints Found
              </h3>
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? 'No matches found for your filter.'
                  : "You haven't generated any blueprints yet."}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/add-blueprint"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors mt-2"
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
                <tr className="bg-muted/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 px-6">Blueprint Info</th>
                  <th className="py-4 px-6">Tech Stack</th>
                  <th className="py-4 px-6">Complexity</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {processedBlueprints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(bp => {
                  const stackList = Array.isArray(bp.teckStack)
                    ? bp.teckStack
                    : bp.teckStack
                      ? bp.teckStack.split(',')
                      : [];

                  const compValue = bp.complexity || bp.complexcity || 'Medium';

                  return (
                    <tr
                      key={bp._id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      <td className="py-4 px-6 max-w-sm">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground font-display line-clamp-1 group-hover:underline transition-all">
                            {bp.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {bp.description}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {stackList.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-muted font-medium text-foreground border border-border"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                          {stackList.length > 3 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted font-bold text-muted-foreground border border-border">
                              +{stackList.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            compValue.toLowerCase() === 'high'
                              ? 'text-rose-500 bg-rose-500/10 border border-rose-500/20'
                              : compValue.toLowerCase() === 'medium'
                                ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                                : 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
                          }`}
                        >
                          {compValue}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            bp.status.toLowerCase() === 'ready'
                              ? 'text-emerald-500 bg-emerald-500/10'
                              : bp.status.toLowerCase() === 'generating'
                                ? 'text-blue-500 bg-blue-500/10 animate-pulse'
                                : 'text-rose-500 bg-rose-500/10'
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
                            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all duration-200"
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
                                ? 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted cursor-pointer'
                                : 'border-border/40 text-muted-foreground/40 bg-muted/20 cursor-not-allowed opacity-50'
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
                            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
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
            {Math.ceil(processedBlueprints.length / itemsPerPage) > 1 && (
              <div className="p-4 border-t border-border">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(processedBlueprints.length / itemsPerPage)}
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
