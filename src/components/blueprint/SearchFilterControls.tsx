'use client';

import { ArrowUpDown, Search, SlidersHorizontal, Layers } from 'lucide-react';
import React from 'react';
import CustomSelect from '@/components/ui/CustomSelect';

interface SearchFilterControlsProps {
  search: string;
  setSearch: (val: string) => void;
  stackFilter: string;
  setStackFilter: (val: string) => void;
  complexityFilter: string;
  setComplexityFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export default function SearchFilterControls({
  search,
  setSearch,
  stackFilter,
  setStackFilter,
  complexityFilter,
  setComplexityFilter,
  sortBy,
  setSortBy,
}: SearchFilterControlsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search blueprints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
        />
      </div>

      {/* Stack Filter */}
      <CustomSelect
        value={stackFilter}
        onChange={setStackFilter}
        icon={<Layers className="h-4 w-4" />}
        options={[
          { value: 'All', label: 'All Stacks' },
          { value: 'Next.js', label: 'Next.js', badge: 'REACT' },
          { value: 'Express', label: 'Express 5', badge: 'API' },
          { value: 'Node', label: 'Node.js' },
          { value: 'Python', label: 'Python' },
          { value: 'WebSockets', label: 'WebSockets', badge: 'REALTIME' },
          { value: 'React', label: 'React' },
          { value: 'MongoDB', label: 'MongoDB', badge: 'DB' },
        ]}
      />

      {/* Complexity Filter */}
      <CustomSelect
        value={complexityFilter}
        onChange={setComplexityFilter}
        icon={<SlidersHorizontal className="h-4 w-4" />}
        options={[
          { value: 'All', label: 'All Complexities' },
          { value: 'Low', label: 'Low Complexity', badge: 'MVP' },
          { value: 'Medium', label: 'Medium Complexity', badge: 'MID' },
          { value: 'High', label: 'High Complexity', badge: 'ENTERPRISE' },
        ]}
      />

      {/* Sorting */}
      <CustomSelect
        value={sortBy}
        onChange={setSortBy}
        icon={<ArrowUpDown className="h-4 w-4" />}
        options={[
          { value: 'newest', label: 'Sort: Newest First' },
          { value: 'rating', label: 'Sort: Highest Rating' },
        ]}
      />
    </div>
  );
}
