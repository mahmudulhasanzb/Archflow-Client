'use client';

import React from 'react';
import Skeleton from '../Skeleton';

interface PageHeaderSkeletonProps {
  className?: string;
}

export default function PageHeaderSkeleton({
  className = '',
}: PageHeaderSkeletonProps) {
  return (
    <div className={`border-b border-border pb-5 space-y-2 ${className}`}>
      <Skeleton className="h-7 w-60" />
      <Skeleton className="h-3.5 w-96 max-w-full" />
    </div>
  );
}
