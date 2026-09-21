'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import {
  getAdminTransactions,
  AdminTransaction,
  TransactionRouteStats,
} from '@/lib/api/admin/data';
import TransactionStats from '@/components/admin/TransactionStats';
import TransactionFilters from '@/components/admin/TransactionFilters';
import TransactionTable from '@/components/admin/TransactionTable';
import PaginationControls from '@/components/ui/Pagination';
import { PageHeaderSkeleton, StatsSkeleton, TableSkeleton } from '@/components/ui/skeletons';

export default function AdminTransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<TransactionRouteStats | undefined>(undefined);

  // Read URL query parameters
  const search = searchParams?.get('search') || '';
  const plan = searchParams?.get('plan') || 'all';
  const timeframe = searchParams?.get('timeframe') || 'all';
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

  // Fetch transactions and revenue stats from MongoDB on filter/page change
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminTransactions({
        search,
        plan,
        timeframe,
        page: currentPage,
        limit: 10,
      });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setTotalCount(data.total);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [search, plan, timeframe, currentPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
    }
  }, [isAdmin, fetchTransactions]);

  if (sessionPending || (!isAdmin && session?.user)) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <PageHeaderSkeleton />
        <StatsSkeleton count={2} />
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
          Transaction History
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Audit customer Stripe checkout orders, search payments, and filter revenue history.
        </p>
      </div>

      {/* Transaction Revenue & Orders Stats */}
      <TransactionStats
        stats={stats}
        totalTransactions={totalCount}
        loading={loading && !stats}
      />

      {/* Search & Filter Controls */}
      <TransactionFilters />

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
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
