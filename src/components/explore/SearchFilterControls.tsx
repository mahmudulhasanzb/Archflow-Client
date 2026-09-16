'use client';

import { ArrowUpDown, Search, SlidersHorizontal } from 'lucide-react';
import React from 'react';

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
      <div className="relative flex items-center">
        <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <select
          value={stackFilter}
          onChange={e => setStackFilter(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none cursor-pointer transition-colors"
        >
          <option value="All">All Stacks</option>
          <option value="Next.js">Next.js</option>
          <option value="Express">Express</option>
          <option value="Node">Node.js</option>
          <option value="Python">Python</option>
          <option value="WebSockets">WebSockets</option>
          <option value="React">React</option>
          <option value="MongoDB">MongoDB</option>
        </select>
      </div>

      {/* Complexity Filter */}
      <div className="relative flex items-center">
        <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <select
          value={complexityFilter}
          onChange={e => setComplexityFilter(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none cursor-pointer transition-colors"
        >
          <option value="All">All Complexities</option>
          <option value="Low">Low Complexity</option>
          <option value="Medium">Medium Complexity</option>
          <option value="High">High Complexity</option>
        </select>
      </div>

      {/* Sorting */}
      <div className="relative flex items-center">
        <ArrowUpDown className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none cursor-pointer transition-colors"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="rating">Sort: Highest Rating</option>
        </select>
      </div>
    </div>
  );
}
