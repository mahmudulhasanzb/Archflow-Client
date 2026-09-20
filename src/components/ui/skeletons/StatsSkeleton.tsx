'use client';

import React from 'react';
import Skeleton from '../Skeleton';

interface StatsSkeletonProps {
  count?: number;
  className?: string;
}

export default function StatsSkeleton({
  count = 4,
  className = '',
}: StatsSkeletonProps) {
  const gridColsClass =
    count === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 bg-card rounded-2xl border border-border/80 shadow-xs flex items-center justify-between gap-4"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
        </div>
      ))}
    </div>
  );
}
