'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, Layers, RefreshCw } from 'lucide-react';
import BlueprintCard from '@/components/BlueprintCard';

interface FilterBlueprintsProps {
  allBlueprints: any[];
  currentSearch?: string;
  currentStack?: string;
  currentComplexity?: string;
  currentSort?: string;
}

export default function FilterBlueprints({
  allBlueprints = [],
  currentSearch = '',
  currentStack = 'All',
  currentComplexity = 'All',
  currentSort = 'newest',
}: FilterBlueprintsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedStack, setSelectedStack] = useState(currentStack || 'All');
  const [selectedComplexity, setSelectedComplexity] = useState(currentComplexity || 'All');
  const [selectedSort, setSelectedSort] = useState(currentSort || 'newest');

  const updateURL = (search: string, stack: string, complexity: string, sort: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');

    if (stack && stack !== 'All') params.set('stack', stack);
    else params.delete('stack');

    if (complexity && complexity !== 'All') params.set('complexity', complexity);
    else params.delete('complexity');

    if (sort && sort !== 'newest') params.set('sort', sort);
    else params.delete('sort');

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchBlur = () => {
    updateURL(searchQuery, selectedStack, selectedComplexity, selectedSort);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateURL(searchQuery, selectedStack, selectedComplexity, selectedSort);
    }
  };

  const handleStackChange = (val: string) => {
    setSelectedStack(val);
    updateURL(searchQuery, val, selectedComplexity, selectedSort);
  };

  const handleComplexityChange = (val: string) => {
    setSelectedComplexity(val);
    updateURL(searchQuery, selectedStack, val, selectedSort);
  };

  const handleSortChange = (val: string) => {
    setSelectedSort(val);
    updateURL(searchQuery, selectedStack, selectedComplexity, val);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedStack('All');
    setSelectedComplexity('All');
    setSelectedSort('newest');
    router.push(pathname);
  };

  return (
    <div>
      {/* Search & Filter Controls Panel */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search blueprints by name or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
            className="w-full rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] pl-10 pr-4 py-2.5 text-xs text-[#181B20] dark:text-[#F3F4F6] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
          />
        </div>

        {/* Stack Filter */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF] pointer-events-none" />
          <select
            value={selectedStack}
            onChange={e => handleStackChange(e.target.value)}
            className="w-full rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] pl-10 pr-4 py-2.5 text-xs text-[#181B20] dark:text-[#F3F4F6] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] appearance-none cursor-pointer transition-colors"
          >
            <option value="All">All Tech Stacks</option>
            <option value="Next.js">Next.js</option>
            <option value="Node">Node.js</option>
            <option value="Express">Express</option>
            <option value="MongoDB">MongoDB</option>
            <option value="Postgres">PostgreSQL</option>
            <option value="Redis">Redis</option>
            <option value="WebSockets">WebSockets</option>
            <option value="Docker">Docker</option>
          </select>
        </div>

        {/* Complexity Filter */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF] pointer-events-none" />
          <select
            value={selectedComplexity}
            onChange={e => handleComplexityChange(e.target.value)}
            className="w-full rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] pl-10 pr-4 py-2.5 text-xs text-[#181B20] dark:text-[#F3F4F6] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] appearance-none cursor-pointer transition-colors"
          >
            <option value="All">All Complexities</option>
            <option value="Low">Low Complexity</option>
            <option value="Medium">Medium Complexity</option>
            <option value="High">High Complexity</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3.5 h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF] pointer-events-none" />
          <select
            value={selectedSort}
            onChange={e => handleSortChange(e.target.value)}
            className="w-full rounded-xl border border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] pl-10 pr-4 py-2.5 text-xs text-[#181B20] dark:text-[#F3F4F6] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] appearance-none cursor-pointer transition-colors"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {allBlueprints.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allBlueprints.map(bp => (
            <BlueprintCard key={bp._id} blueprint={bp} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#E1E4EA] dark:border-[#222C43] bg-white dark:bg-[#0E1321] p-16 text-center max-w-lg mx-auto space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#EEF0FF] dark:bg-[#4F46E5]/15 flex items-center justify-center text-[#4F46E5] dark:text-[#818CF8]">
            <Layers className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#181B20] dark:text-[#F3F4F6] font-display">
              No Blueprints Found
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              No architecture blueprints matched your search or filters.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold hover:bg-[#4338CA] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
