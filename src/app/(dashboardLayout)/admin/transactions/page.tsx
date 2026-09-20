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
import TransactionTable from '@/components/admin/TransactionTable';
import PaginationControls from '@/components/ui/Pagination';

export default function AdminTransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<TransactionRouteStats | undefined>(undefined);

  // Read current page from URL
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

  // Fetch transactions and revenue stats from MongoDB on page change
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminTransactions({
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
  }, [currentPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
    }
  }, [isAdmin, fetchTransactions]);

  if (sessionPending || (!isAdmin && session?.user)) {
    return (
      <div className="flex-1 p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 bg-muted/60 rounded-2xl" />
          <div className="h-28 bg-muted/60 rounded-2xl" />
        </div>
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
          Transaction History
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Audit customer Stripe checkout orders and subscription payments.
        </p>
      </div>

      {/* Transaction Revenue & Orders Stats */}
      <TransactionStats
        stats={stats}
        totalTransactions={totalCount}
        loading={loading && !stats}
      />

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
