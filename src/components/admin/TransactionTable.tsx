'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AdminTransaction } from '@/lib/api/admin/data';

interface TransactionTableProps {
  transactions: AdminTransaction[];
  loading?: boolean;
}

export default function TransactionTable({
  transactions,
  loading = false,
}: TransactionTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Customer Email</th>
              <th className="py-3 px-4">Plan Item</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx._id} className="hover:bg-muted/20 transition-colors">
                  {/* Transaction ID */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-foreground font-semibold">
                    <span
                      className="bg-muted/50 px-1.5 py-0.5 rounded border border-border"
                      title={tx.transactionId}
                    >
                      {tx.transactionId.length > 20
                        ? `${tx.transactionId.slice(0, 18)}...`
                        : tx.transactionId}
                    </span>
                  </td>

                  {/* Customer Email */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-foreground">
                    {tx.userEmail}
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4 text-xs font-semibold text-foreground">
                    {tx.planName}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-emerald-500">
                    ${tx.amount.toFixed(2)} {tx.currency}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-[11px] text-muted-foreground font-mono">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'N/A'}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>COMPLETED</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
