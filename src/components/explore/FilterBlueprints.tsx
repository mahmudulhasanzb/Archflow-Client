'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, Layers, RefreshCw } from 'lucide-react';
import BlueprintCard from '@/components/BlueprintCard';
import CustomSelect from '@/components/ui/CustomSelect';

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
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blueprints by name or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
          />
        </div>

        {/* Stack Filter */}
        <CustomSelect
          value={selectedStack}
          onChange={handleStackChange}
          icon={<Layers className="h-4 w-4" />}
          options={[
            { value: 'All', label: 'All Tech Stacks' },
            { value: 'Next.js', label: 'Next.js', badge: 'REACT' },
            { value: 'Node', label: 'Node.js' },
            { value: 'Express', label: 'Express 5', badge: 'API' },
            { value: 'MongoDB', label: 'MongoDB', badge: 'DB' },
            { value: 'Postgres', label: 'PostgreSQL', badge: 'SQL' },
            { value: 'Redis', label: 'Redis', badge: 'CACHE' },
            { value: 'WebSockets', label: 'WebSockets', badge: 'REALTIME' },
            { value: 'Docker', label: 'Docker' },
          ]}
        />

        {/* Complexity Filter */}
        <CustomSelect
          value={selectedComplexity}
          onChange={handleComplexityChange}
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
          value={selectedSort}
          onChange={handleSortChange}
          icon={<ArrowUpDown className="h-4 w-4" />}
          options={[
            { value: 'newest', label: 'Sort: Newest First' },
            { value: 'rating', label: 'Sort: Highest Rating' },
            { value: 'oldest', label: 'Sort: Oldest First' },
          ]}
        />
      </div>

      {/* Grid or Empty State */}
      {allBlueprints.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allBlueprints.map(bp => (
            <BlueprintCard key={bp._id} blueprint={bp} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center max-w-lg mx-auto space-y-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-muted text-foreground border border-border flex items-center justify-center">
            <Layers className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-display">
              No Blueprints Found
            </h3>
            <p className="text-xs text-muted-foreground">
              No architecture blueprints matched your search or filters.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
