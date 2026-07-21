import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors disabled:opacity-50"
      >
        Prev
      </button>
      
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#181B20]">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`h-8 w-8 rounded-lg border text-center transition-colors ${
                currentPage === pageNum
                  ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                  : 'bg-white border-[#E1E4EA] text-[#181B20] hover:bg-[#F1F3F6]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-[#E1E4EA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] transition-colors disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
