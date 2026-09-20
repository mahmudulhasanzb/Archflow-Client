'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { getAdminBlueprints, AdminBlueprint } from '@/lib/api/admin/data';
import {
  toggleAdminBlueprintVisibilityAction,
  deleteAdminBlueprintAction,
} from '@/lib/api/admin/action';
import AdminBlueprintFilters from '@/components/admin/AdminBlueprintFilters';
import AdminBlueprintTable from '@/components/admin/AdminBlueprintTable';
import DeleteModal from '@/components/blueprint/DeleteModal';
import PaginationControls from '@/components/ui/Pagination';

export default function AdminManageBlueprintsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [blueprints, setBlueprints] = useState<AdminBlueprint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Mutation loading & delete modal state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<AdminBlueprint | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Read URL query parameters
  const search = searchParams?.get('search') || '';
  const visibility = searchParams?.get('visibility') || 'all';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const isAdmin = (session?.user as any)?.role?.toLowerCase() === 'admin';

  // Protect admin route
  useEffect(() => {
    if (!sessionPending) {
      if (!session?.user || !isAdmin) {
        toast.error('Access restricted to administrators');
        router.push('/workspace');
      }
    }
  }, [sessionPending, session?.user, isAdmin, router]);

  // Fetch blueprints from database on URL query change
  const fetchBlueprints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminBlueprints({
        search,
        visibility,
        page: currentPage,
        limit: 10,
      });
      setBlueprints(data.blueprints);
      setTotalPages(data.totalPages);
      setTotalCount(data.total);
    } catch (err) {
      console.error('Failed to load admin blueprints:', err);
      toast.error('Failed to load blueprints');
    } finally {
      setLoading(false);
    }
  }, [search, visibility, currentPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchBlueprints();
    }
  }, [isAdmin, fetchBlueprints]);

  // Handle Visibility Toggle
  const handleToggleVisibility = async (bp: AdminBlueprint) => {
    const nextVisibility = bp.visibility === 'public' ? 'private' : 'public';
    setActionLoadingId(bp._id);
    const toastId = toast.loading(`Setting visibility to ${nextVisibility}...`);

    try {
      const result = await toggleAdminBlueprintVisibilityAction(bp._id, nextVisibility);
      if (result.success) {
        toast.success(`Blueprint is now ${nextVisibility}`, { id: toastId });
        setBlueprints(prev =>
          prev.map(item =>
            item._id === bp._id ? { ...item, visibility: nextVisibility } : item
          )
        );
      } else {
        toast.error(result.error || 'Failed to update visibility', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating visibility', { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Modal
  const handleOpenDelete = (bp: AdminBlueprint) => {
    setSelectedBlueprint(bp);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlueprint) return;
    setDeleteLoading(true);
    const toastId = toast.loading('Purging blueprint from database...');

    try {
      const result = await deleteAdminBlueprintAction(selectedBlueprint._id);
      if (result.success) {
        toast.success('Blueprint permanently deleted', { id: toastId });
        setBlueprints(prev => prev.filter(item => item._id !== selectedBlueprint._id));
        setIsDeleteOpen(false);
        setSelectedBlueprint(null);
      } else {
        toast.error(result.error || 'Failed to delete blueprint', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting blueprint', { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (sessionPending || (!isAdmin && session?.user)) {
    return (
      <div className="flex-1 p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="h-12 bg-muted/60 rounded-2xl" />
        <div className="h-96 bg-muted/40 rounded-2xl" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Manage Platform Blueprints
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Moderate community architecture blueprints, manage public/private visibility, or purge records.
        </p>
      </div>

      {/* URL-Driven Filters */}
      <AdminBlueprintFilters />

      {/* Blueprints Moderation Table */}
      <AdminBlueprintTable
        blueprints={blueprints}
        loading={loading}
        onToggleVisibility={handleToggleVisibility}
        onDelete={handleOpenDelete}
        actionLoadingId={actionLoadingId}
      />

      {/* URL-driven Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}

      {/* Reusable Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        blueprintTitle={selectedBlueprint?.title || ''}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
