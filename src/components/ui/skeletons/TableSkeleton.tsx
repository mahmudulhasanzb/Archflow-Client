'use client';

import React from 'react';
import Skeleton from '../Skeleton';

interface TableSkeletonProps {
  rows?: number;
  /** Alias for columns — use either */
  cols?: number;
  columns?: number;
  hasSearch?: boolean;
  className?: string;
}

export default function TableSkeleton({
  rows = 5,
  cols,
  columns,
  hasSearch = false,
  className = '',
}: TableSkeletonProps) {
  const colCount = cols ?? columns ?? 5;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Optional search/filter bar skeleton */}
      {hasSearch && (
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-56 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      )}

      {/* Table body */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {Array.from({ length: colCount }).map((_, i) => (
                  <th key={i} className="py-3 px-4">
                    <Skeleton className="h-3.5 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r} className="hover:bg-muted/10">
                  {Array.from({ length: colCount }).map((_, c) => (
                    <td key={c} className="py-4 px-4">
                      {c === 0 ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-2.5 w-40" />
                          </div>
                        </div>
                      ) : c === colCount - 1 ? (
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-24 rounded-xl" />
                        </div>
                      ) : (
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
