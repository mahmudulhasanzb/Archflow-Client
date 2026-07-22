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

const SearchFilterControls = ({
  search,
  setSearch,
  stackFilter,
  setStackFilter,
  complexityFilter,
  setComplexityFilter,
  sortBy,
  setSortBy,
}: SearchFilterControlsProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search blueprints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800"
        />
      </div>

      {/* Stack Filter */}
      <div className="relative flex items-center">
        <SlidersHorizontal className="absolute left-3 h-4 w-4 text-[#6B7280] pointer-events-none" />
        <select
          value={stackFilter}
          onChange={e => setStackFilter(e.target.value)}
          className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800 appearance-none cursor-pointer"
        >
          <option value="All">All Stacks</option>
          <option value="Next.js">Next.js</option>
          <option value="Express">Express</option>
          <option value="Node">Node</option>
          <option value="Python">Python</option>
          <option value="WebSockets">WebSockets</option>
          <option value="React">React</option>
          <option value="MongoDB">MongoDB</option>
        </select>
      </div>

      {/* Complexity Filter */}
      <div className="relative flex items-center">
        <SlidersHorizontal className="absolute left-3 h-4 w-4 text-[#6B7280] pointer-events-none" />
        <select
          value={complexityFilter}
          onChange={e => setComplexityFilter(e.target.value)}
          className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800 appearance-none cursor-pointer"
        >
          <option value="All">All Complexities</option>
          <option value="Low">Low Complexity</option>
          <option value="Medium">Medium Complexity</option>
          <option value="High">High Complexity</option>
        </select>
      </div>

      {/* Sorting */}
      <div className="relative flex items-center">
        <ArrowUpDown className="absolute left-3 h-4 w-4 text-[#6B7280] pointer-events-none" />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full rounded-lg border border-[#E1E4EA] pl-9 pr-4 py-2 text-sm focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white text-slate-800 appearance-none cursor-pointer"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="rating">Sort: Highest Rating</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilterControls;
