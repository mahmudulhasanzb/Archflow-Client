'use client';

import React from 'react';
import { DollarSign, CreditCard } from 'lucide-react';
import { TransactionRouteStats } from '@/lib/api/admin/data';

interface TransactionStatsProps {
  stats?: TransactionRouteStats;
  totalTransactions?: number;
  loading?: boolean;
}

export default function TransactionStats({
  stats,
  totalTransactions = 0,
  loading,
}: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Total Amount (Gross Revenue) */}
      <div className="p-5 bg-card rounded-2xl border border-border shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Transaction Amount
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-display mt-1">
            {loading ? (
              <span className="inline-block h-8 w-28 bg-muted/60 rounded animate-pulse" />
            ) : (
              `$${(stats?.totalAmount ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD`
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Gross revenue processed through Stripe
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
          <DollarSign className="h-6 w-6" />
        </div>
      </div>

      {/* Total Transactions Count */}
      <div className="p-5 bg-card rounded-2xl border border-border shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Orders
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-display mt-1">
            {loading ? (
              <span className="inline-block h-8 w-16 bg-muted/60 rounded animate-pulse" />
            ) : (
              totalTransactions.toLocaleString()
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Completed checkout transactions
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <CreditCard className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
