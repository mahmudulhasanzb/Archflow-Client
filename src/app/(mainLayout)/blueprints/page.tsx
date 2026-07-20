'use client';

import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

export default function ExplorePage() {

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow">
        <div className="text-center py-20 bg-white rounded-xl border border-[#E1E4EA]">
          <SlidersHorizontal className="mx-auto h-12 w-12 text-[#6B7280] mb-4" />
          <h3 className="text-lg font-bold text-[#181B20] font-display">
            No blueprints found
          </h3>
          <p className="text-sm text-[#6B7280] mt-1">
            Try adjusting your search query or filter parameters.
          </p>
        </div>


    </div>
  );
}
