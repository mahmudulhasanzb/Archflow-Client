'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { getAdminUsers, AdminUser, UserRouteStats } from '@/lib/api/admin/data';
import {
  toggleUserBlockAction,
  updateUserRoleAction,
} from '@/lib/api/admin/action';
import UserStats from '@/components/admin/UserStats';
import UserFilters from '@/components/admin/UserFilters';
import UserTable from '@/components/admin/UserTable';
import PaginationControls from '@/components/ui/Pagination';

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState<UserRouteStats | undefined>(undefined);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Read state directly from URL query parameters
  const search = searchParams?.get('search') || '';
  const role = searchParams?.get('role') || 'all';
  const status = searchParams?.get('status') || 'all';
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

  // Fetch users and stats from MongoDB whenever URL query parameters change
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers({
        search,
        role,
        status,
        page: currentPage,
        limit: 10,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, role, status, currentPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  // Handle soft-block toggle
  const handleToggleBlock = async (user: AdminUser) => {
    const nextBlockedState = !user.isGenerationBlocked;
    setActionLoadingId(user._id);
    const toastId = toast.loading(
      nextBlockedState
        ? `Restricting blueprint generation for ${user.email}...`
        : `Restoring blueprint generation for ${user.email}...`
    );

    try {
      const result = await toggleUserBlockAction(user._id, nextBlockedState);
      if (result.success) {
        toast.success(result.message || 'Block status updated', { id: toastId });
        setUsers(prev =>
          prev.map(u =>
            u._id === user._id
              ? { ...u, isGenerationBlocked: nextBlockedState }
              : u
          )
        );
        // Dynamically update stats count
        setStats(prev =>
          prev
            ? {
                ...prev,
                blockedUsers: nextBlockedState
                  ? prev.blockedUsers + 1
                  : Math.max(0, prev.blockedUsers - 1),
              }
            : undefined
        );
      } else {
        toast.error(result.error || 'Failed to update user status', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error updating user status', { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle role toggle (Free ↔ Pro)
  const handleToggleRole = async (user: AdminUser) => {
    const nextRole = user.role === 'pro' ? 'free' : 'pro';
    setActionLoadingId(user._id);
    const toastId = toast.loading(
      `Changing ${user.email} plan to ${nextRole.toUpperCase()}...`
    );

    try {
      const result = await updateUserRoleAction(user._id, nextRole as 'free' | 'pro');
      if (result.success) {
        toast.success(`Plan updated to ${nextRole.toUpperCase()}`, { id: toastId });
        setUsers(prev =>
          prev.map(u =>
            u._id === user._id
              ? { ...u, role: nextRole, plan: nextRole }
              : u
          )
        );
        // Dynamically update stats count
        setStats(prev => {
          if (!prev) return undefined;
          const isNextPro = nextRole === 'pro';
          return {
            ...prev,
            proUsers: isNextPro ? prev.proUsers + 1 : Math.max(0, prev.proUsers - 1),
            freeUsers: isNextPro ? Math.max(0, prev.freeUsers - 1) : prev.freeUsers + 1,
          };
        });
      } else {
        toast.error(result.error || 'Failed to update plan', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error updating plan', { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (sessionPending || (!isAdmin && session?.user)) {
    return (
      <div className="flex-1 p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted/60 rounded-2xl" />
          ))}
        </div>
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
          User Management
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage user permissions, toggle Free/Pro subscription tiers, and soft-block blueprint generation.
        </p>
      </div>

      {/* User Statistics */}
      <UserStats stats={stats} loading={loading && !stats} />

      {/* URL-driven Filters */}
      <UserFilters />

      {/* Users Table */}
      <UserTable
        users={users}
        loading={loading}
        onToggleBlock={handleToggleBlock}
        onToggleRole={handleToggleRole}
        actionLoadingId={actionLoadingId}
      />

      {/* URL-driven Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
