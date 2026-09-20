'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';

const visibilityOptions: SelectOption<string>[] = [
  { value: 'all', label: 'All Visibilities' },
  { value: 'public', label: 'Public Only' },
  { value: 'private', label: 'Private Only' },
];

export default function AdminBlueprintFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get('search') || '';
  const currentVisibility = searchParams?.get('visibility') || 'all';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateURL = (search: string, visibility: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');

    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');

    if (visibility && visibility !== 'all') params.set('visibility', visibility);
    else params.delete('visibility');

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(searchInput, currentVisibility);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateURL('', currentVisibility);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search blueprints by title or author email (press Enter)..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Visibility Filter using CustomSelect */}
      <div className="w-full sm:w-48">
        <CustomSelect
          value={currentVisibility}
          onChange={newVis => updateURL(searchInput, newVis)}
          options={visibilityOptions}
          size="sm"
        />
      </div>
    </div>
  );
}
