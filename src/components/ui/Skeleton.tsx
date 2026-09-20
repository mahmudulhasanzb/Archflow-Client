'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({
  className = '',
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`rounded-xl bg-muted/70 relative overflow-hidden ${
        shimmer
          ? 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent'
          : 'animate-pulse'
      } ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
