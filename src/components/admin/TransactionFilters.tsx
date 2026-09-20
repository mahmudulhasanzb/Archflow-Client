'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';

const planOptions: SelectOption<string>[] = [
  { value: 'all', label: 'All Plans' },
  { value: 'pro', label: 'Pro Subscription' },
];

const timeframeOptions: SelectOption<string>[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Past 24 Hours' },
  { value: '7d', label: 'Past 7 Days' },
  { value: '30d', label: 'Past 30 Days' },
];

export default function TransactionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get('search') || '';
  const currentPlan = searchParams?.get('plan') || 'all';
  const currentTimeframe = searchParams?.get('timeframe') || 'all';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateURL = (search: string, plan: string, timeframe: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');

    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');

    if (plan && plan !== 'all') params.set('plan', plan);
    else params.delete('plan');

    if (timeframe && timeframe !== 'all') params.set('timeframe', timeframe);
    else params.delete('timeframe');

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(searchInput, currentPlan, currentTimeframe);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateURL('', currentPlan, currentTimeframe);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by customer email or transaction ID (press Enter)..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Filter Dropdowns */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {/* Plan Filter */}
        <div className="w-full sm:w-44">
          <CustomSelect
            value={currentPlan}
            onChange={newPlan => updateURL(searchInput, newPlan, currentTimeframe)}
            options={planOptions}
            size="sm"
          />
        </div>

        {/* Timeframe Filter */}
        <div className="w-full sm:w-40">
          <CustomSelect
            value={currentTimeframe}
            onChange={newTime => updateURL(searchInput, currentPlan, newTime)}
            options={timeframeOptions}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
