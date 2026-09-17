'use client';

import React, { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

function getPageNumbers(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | string)[] = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total);
  } else if (current >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }

  return pages;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paramName?: string;
  onPageChange?: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  paramName = 'page',
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateTo = useCallback(
    (page: number) => {
      if (onPageChange) {
        onPageChange(page);
        return;
      }
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.set(paramName, String(page));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, paramName, onPageChange],
  );

  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center pt-8 border-t border-border select-none"
    >
      <ul className="flex items-center gap-2">
        {/* ← Previous */}
        <li>
          <button
            type="button"
            onClick={() => !isFirst && navigateTo(currentPage - 1)}
            disabled={isFirst}
            aria-label="Previous page"
            className={[
              'inline-flex h-9 items-center justify-center px-3.5',
              'text-xs font-bold uppercase tracking-wider',
              'bg-transparent border-0 rounded-xl',
              'transition-colors duration-200',
              isFirst
                ? 'text-muted-foreground/30 cursor-not-allowed'
                : 'text-foreground hover:underline cursor-pointer',
            ].join(' ')}
          >
            ← Prev
          </button>
        </li>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <li
              key={`ellipsis-${idx}`}
              className="text-muted-foreground/50 text-xs font-bold px-1 select-none font-mono"
              aria-hidden="true"
            >
              ···
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => navigateTo(Number(p))}
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
                className={[
                  'inline-flex h-9 w-9 items-center justify-center',
                  'text-xs font-bold rounded-xl font-mono',
                  'transition-all duration-200 cursor-pointer',
                  p === currentPage
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-card border border-border text-foreground hover:bg-muted hover:border-foreground/30',
                ].join(' ')}
              >
                {p}
              </button>
            </li>
          ),
        )}

        {/* Next → */}
        <li>
          <button
            type="button"
            onClick={() => !isLast && navigateTo(currentPage + 1)}
            disabled={isLast}
            aria-label="Next page"
            className={[
              'inline-flex h-9 items-center justify-center px-3.5',
              'text-xs font-bold uppercase tracking-wider',
              'bg-transparent border-0 rounded-xl',
              'transition-colors duration-200',
              isLast
                ? 'text-muted-foreground/30 cursor-not-allowed'
                : 'text-foreground hover:underline cursor-pointer',
            ].join(' ')}
          >
            Next →
          </button>
        </li>
      </ul>
    </nav>
  );
}
