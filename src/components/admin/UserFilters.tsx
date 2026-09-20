'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';

const roleOptions: SelectOption<string>[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'pro', label: 'Pro Plan' },
  { value: 'free', label: 'Free Plan' },
];

const statusOptions: SelectOption<string>[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Restricted' },
];

export default function UserFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams?.get('search') || '';
  const currentRole = searchParams?.get('role') || 'all';
  const currentStatus = searchParams?.get('status') || 'all';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateURL = (search: string, role: string, status: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');

    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');

    if (role && role !== 'all') params.set('role', role);
    else params.delete('role');

    if (status && status !== 'all') params.set('status', status);
    else params.delete('status');

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(searchInput, currentRole, currentStatus);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateURL('', currentRole, currentStatus);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name or email (press Enter)..."
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

      {/* Filters using CustomSelect */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        <div className="w-full sm:w-40">
          <CustomSelect
            value={currentRole}
            onChange={newRole => updateURL(searchInput, newRole, currentStatus)}
            options={roleOptions}
            size="sm"
          />
        </div>

        <div className="w-full sm:w-44">
          <CustomSelect
            value={currentStatus}
            onChange={newStatus => updateURL(searchInput, currentRole, newStatus)}
            options={statusOptions}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
