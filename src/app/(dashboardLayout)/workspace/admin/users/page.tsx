'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { getAdminUsers, AdminUser, UserRouteStats } from '@/lib/api/admin/data';
import { PageHeaderSkeleton, StatsSkeleton, TableSkeleton } from '@/components/ui/skeletons';
import {
  toggleUserBlockAction,
  updateUserRoleAction,
} from '@/lib/api/admin/action';
import UserStats from '@/components/admin/UserStats';
import UserFilters from '@/components/admin/UserFilters';
import UserTable from '@/components/admin/UserTable';
import RoleChangeModal from '@/components/admin/RoleChangeModal';
import PlanChangeModal from '@/components/admin/PlanChangeModal';
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

  // Role confirmation modal state (Admin ↔ User)
  const [roleModalUser, setRoleModalUser] = useState<AdminUser | null>(null);
  const [roleModalTarget, setRoleModalTarget] = useState<'admin' | 'user'>('admin');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalLoading, setRoleModalLoading] = useState(false);

  // Plan confirmation modal state (Free ↔ Pro)
  const [planModalUser, setPlanModalUser] = useState<AdminUser | null>(null);
  const [planModalTarget, setPlanModalTarget] = useState<'free' | 'pro'>('free');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planModalLoading, setPlanModalLoading] = useState(false);

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

  // Open plan change confirmation modal
  const handleOpenPlanModal = (user: AdminUser) => {
    const nextPlan = user.role === 'pro' || user.plan === 'pro' ? 'free' : 'pro';
    setPlanModalUser(user);
    setPlanModalTarget(nextPlan);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    if (!planModalLoading) {
      setIsPlanModalOpen(false);
      setPlanModalUser(null);
    }
  };

  // Execute confirmed plan change (Free ↔ Pro)
  const handleConfirmPlanChange = async () => {
    if (!planModalUser) return;
    setPlanModalLoading(true);
    const toastId = toast.loading(
      `Changing ${planModalUser.email} plan to ${planModalTarget.toUpperCase()}...`
    );

    try {
      const result = await updateUserRoleAction(planModalUser._id, planModalTarget);
      if (result.success) {
        toast.success(`Plan updated to ${planModalTarget.toUpperCase()}`, { id: toastId });
        setUsers(prev =>
          prev.map(u =>
            u._id === planModalUser._id
              ? { ...u, role: planModalTarget, plan: planModalTarget }
              : u
          )
        );
        // Dynamically update stats count
        setStats(prev => {
          if (!prev) return undefined;
          const isNextPro = planModalTarget === 'pro';
          return {
            ...prev,
            proUsers: isNextPro ? prev.proUsers + 1 : Math.max(0, prev.proUsers - 1),
            freeUsers: isNextPro ? Math.max(0, prev.freeUsers - 1) : prev.freeUsers + 1,
          };
        });
        setIsPlanModalOpen(false);
        setPlanModalUser(null);
      } else {
        toast.error(result.error || 'Failed to update plan', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error updating plan', { id: toastId });
    } finally {
      setPlanModalLoading(false);
    }
  };

  // Open role change confirmation modal (Admin ↔ User)
  const handleOpenRoleModal = (user: AdminUser, targetRole: 'admin' | 'user') => {
    setRoleModalUser(user);
    setRoleModalTarget(targetRole);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    if (!roleModalLoading) {
      setIsRoleModalOpen(false);
      setRoleModalUser(null);
    }
  };

  // Execute confirmed role change (Admin ↔ User)
  const handleConfirmRoleChange = async () => {
    if (!roleModalUser) return;
    setRoleModalLoading(true);
    const toastId = toast.loading(
      roleModalTarget === 'admin'
        ? `Promoting ${roleModalUser.email} to Administrator...`
        : `Demoting ${roleModalUser.email} to Standard User...`
    );

    try {
      const result = await updateUserRoleAction(roleModalUser._id, roleModalTarget);
      if (result.success) {
        toast.success(
          result.message ||
            (roleModalTarget === 'admin'
              ? 'User successfully promoted to Administrator'
              : 'Administrator privileges revoked'),
          { id: toastId }
        );
        setUsers(prev =>
          prev.map(u =>
            u._id === roleModalUser._id
              ? {
                  ...u,
                  role: roleModalTarget,
                  plan: roleModalTarget === 'admin' ? u.plan : 'free',
                }
              : u
          )
        );
        setIsRoleModalOpen(false);
        setRoleModalUser(null);
      } else {
        toast.error(result.error || 'Failed to update user role', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error updating user role', { id: toastId });
    } finally {
      setRoleModalLoading(false);
    }
  };

  if (sessionPending || (!isAdmin && session?.user)) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <PageHeaderSkeleton />
        <StatsSkeleton count={4} />
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
          User Management
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage user permissions, assign administrator roles, and soft-block blueprint generation.
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
        onToggleRole={handleOpenPlanModal}
        onOpenRoleChangeModal={handleOpenRoleModal}
        actionLoadingId={actionLoadingId}
        currentUserEmail={session?.user?.email}
      />

      {/* URL-driven Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}

      {/* Confirmation Modal for Role Changes (Admin ↔ User) */}
      <RoleChangeModal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        onConfirm={handleConfirmRoleChange}
        user={roleModalUser}
        targetRole={roleModalTarget}
        loading={roleModalLoading}
      />

      {/* Simple Confirmation Modal for Plan Changes (Free ↔ Pro) */}
      <PlanChangeModal
        isOpen={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onConfirm={handleConfirmPlanChange}
        user={planModalUser}
        targetPlan={planModalTarget}
        loading={planModalLoading}
      />
    </div>
  );
}
