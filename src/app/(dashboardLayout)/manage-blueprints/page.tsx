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
import VisibilityChangeModal from '@/components/admin/VisibilityChangeModal';
import PaginationControls from '@/components/ui/Pagination';
import { PageHeaderSkeleton, TableSkeleton } from '@/components/ui/skeletons';

export default function AdminManageBlueprintsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [blueprints, setBlueprints] = useState<AdminBlueprint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Visibility modal state
  const [visibilityBlueprint, setVisibilityBlueprint] = useState<AdminBlueprint | null>(null);
  const [targetVisibility, setTargetVisibility] = useState<'public' | 'private'>('public');
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  // Delete modal state
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

  // Open Visibility Change Confirmation Modal
  const handleOpenVisibilityModal = (bp: AdminBlueprint) => {
    const nextVisibility = bp.visibility === 'public' ? 'private' : 'public';
    setVisibilityBlueprint(bp);
    setTargetVisibility(nextVisibility);
    setIsVisibilityOpen(true);
  };

  const handleCloseVisibilityModal = () => {
    if (!visibilityLoading) {
      setIsVisibilityOpen(false);
      setVisibilityBlueprint(null);
    }
  };

  // Confirm Visibility Change
  const handleConfirmVisibilityChange = async () => {
    if (!visibilityBlueprint) return;
    setVisibilityLoading(true);
    const toastId = toast.loading(`Setting visibility to ${targetVisibility}...`);

    try {
      const result = await toggleAdminBlueprintVisibilityAction(
        visibilityBlueprint._id,
        targetVisibility
      );
      if (result.success) {
        toast.success(`Blueprint is now ${targetVisibility}`, { id: toastId });
        setBlueprints(prev =>
          prev.map(item =>
            item._id === visibilityBlueprint._id
              ? { ...item, visibility: targetVisibility }
              : item
          )
        );
        setIsVisibilityOpen(false);
        setVisibilityBlueprint(null);
      } else {
        toast.error(result.error || 'Failed to update visibility', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating visibility', { id: toastId });
    } finally {
      setVisibilityLoading(false);
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
      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <PageHeaderSkeleton />
        <TableSkeleton rows={8} cols={5} hasSearch />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-5 relative">
        {/* Gradient border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">
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
        onToggleVisibility={handleOpenVisibilityModal}
        onDelete={handleOpenDelete}
        actionLoadingId={visibilityLoading && visibilityBlueprint ? visibilityBlueprint._id : null}
      />

      {/* URL-driven Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}

      {/* Simple Visibility Confirmation Modal */}
      <VisibilityChangeModal
        isOpen={isVisibilityOpen}
        onClose={handleCloseVisibilityModal}
        onConfirm={handleConfirmVisibilityChange}
        blueprint={visibilityBlueprint}
        targetVisibility={targetVisibility}
        loading={visibilityLoading}
      />

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
