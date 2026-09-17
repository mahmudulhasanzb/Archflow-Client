'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  RotateCcw,
  X,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import BlueprintCard from '@/components/BlueprintCard';
import PaginationControls from '@/components/Pagination';
import CustomSelect from '@/components/ui/CustomSelect';
import { authClient } from '@/lib/auth-client';
import { getUserBookmarksAction } from '@/lib/api/blueprint/action';

interface FilterBlueprintsProps {
  allBlueprints: any[];
  totalData: number;
  currentPage: number;
  totalPages: number;
  currentSearch?: string;
  currentStack?: string;
  currentSort?: string;
}

const POPULAR_STACKS = [
  { label: 'All Stacks', value: 'All' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'React', value: 'React' },
  { label: 'Tailwind CSS', value: 'Tailwind' },
  { label: 'Node.js', value: 'Node' },
  { label: 'Express 5', value: 'Express' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'PostgreSQL', value: 'Postgres' },
  { label: 'Redis', value: 'Redis' },
  { label: 'Docker', value: 'Docker' },
  { label: 'WebSockets', value: 'WebSockets' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function FilterBlueprints({
  allBlueprints = [],
  totalData = 0,
  currentPage = 1,
  totalPages = 1,
  currentSearch = '',
  currentStack = 'All',
  currentSort = 'newest',
}: FilterBlueprintsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedStack, setSelectedStack] = useState(currentStack || 'All');
  const [selectedSort, setSelectedSort] = useState(currentSort || 'newest');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync saved bookmarks from database (only for authenticated users)
  useEffect(() => {
    if (!session?.user) {
      setSavedIds([]);
      return;
    }
    let isMounted = true;
    getUserBookmarksAction()
      .then(res => {
        if (isMounted && res?.success && Array.isArray(res.bookmarkIds)) {
          setSavedIds(res.bookmarkIds);
        }
      })
      .catch(() => {
        if (isMounted) setSavedIds([]);
      });

    return () => {
      isMounted = false;
    };
  }, [session?.user]);

  const handleBookmarkToggle = (blueprintId: string, isSaved: boolean) => {
    setSavedIds(prev =>
      isSaved
        ? Array.from(new Set([...prev, blueprintId]))
        : prev.filter(id => id !== blueprintId),
    );
  };

  // Sync state if URL params change externally
  useEffect(() => {
    setSearchQuery(currentSearch);
    setSelectedStack(currentStack || 'All');
    setSelectedSort(currentSort || 'newest');
  }, [currentSearch, currentStack, currentSort]);

  const updateURL = (search: string, stack: string, sort: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');

    if (stack && stack !== 'All') params.set('stack', stack);
    else params.delete('stack');

    if (sort && sort !== 'newest') params.set('sort', sort);
    else params.delete('sort');

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    updateURL(searchQuery, selectedStack, selectedSort);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateURL('', selectedStack, selectedSort);
  };

  const handleStackSelect = (stack: string) => {
    setSelectedStack(stack);
    updateURL(searchQuery, stack, selectedSort);
  };

  const handleSortChange = (sortVal: string) => {
    setSelectedSort(sortVal);
    updateURL(searchQuery, selectedStack, sortVal);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setSelectedStack('All');
    setSelectedSort('newest');
    setShowSavedOnly(false);
    router.push(pathname);
    setIsMobileDrawerOpen(false);
  };

  // Active filters count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedStack !== 'All') count++;
    if (selectedSort !== 'newest') count++;
    if (showSavedOnly) count++;
    return count;
  }, [searchQuery, selectedStack, selectedSort, showSavedOnly]);

  // Client-side saved filtering if toggle is active
  const displayedBlueprints = useMemo(() => {
    if (!showSavedOnly) return allBlueprints;
    return allBlueprints.filter(bp => savedIds.includes(bp._id));
  }, [allBlueprints, showSavedOnly, savedIds]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (<lg: hidden, lg: sticky left column)                */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-24 self-start rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-5 shadow-xs hover:border-foreground/20 hover:shadow-md transition-all duration-300 space-y-5">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-bold text-foreground font-display tracking-tight">
              Filters & Search
            </h2>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-muted/60"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Search Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Keywords</span>
            {searchQuery && (
              <span className="text-[10px] text-muted-foreground font-mono">
                Press Enter
              </span>
            )}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, prompt..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={handleSearchSubmit}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-2.5 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sort By Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            <span>Sort Order</span>
          </label>
          <CustomSelect
            value={selectedSort}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            size="sm"
          />
        </div>

        {/* Saved Blueprints Quick Toggle */}
        <div className="rounded-xl border border-border/70 bg-muted/20 p-3 hover:bg-muted/40 hover:border-border transition-all">
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <Bookmark className={`h-3.5 w-3.5 ${showSavedOnly ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium text-foreground">
                Saved Only
              </span>
            </div>
            <input
              type="checkbox"
              checked={showSavedOnly}
              onChange={e => setShowSavedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer accent-primary"
            />
          </label>
        </div>

        {/* Tech Stack Pills List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-muted-foreground" />
              <span>Tech Stack</span>
            </label>
            {selectedStack !== 'All' && (
              <button
                type="button"
                onClick={() => handleStackSelect('All')}
                className="text-[10px] text-primary hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_STACKS.map(stack => {
              const isSelected = selectedStack === stack.value;
              return (
                <button
                  key={stack.value}
                  type="button"
                  onClick={() => handleStackSelect(stack.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs border border-primary/50'
                      : 'border border-border/70 bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border'
                  }`}
                >
                  {stack.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Meta info badge */}
        <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span>Curated production architectures ready for AI code agents.</span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE / TABLET TOP BAR (<lg: Visible, lg: Hidden)                    */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col gap-3 w-full">
        {/* Mobile Search & Filter Button Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blueprints..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={handleSearchSubmit}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Horizontal Quick Tech Stack Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {POPULAR_STACKS.slice(0, 8).map(stack => {
            const isSelected = selectedStack === stack.value;
            return (
              <button
                key={stack.value}
                type="button"
                onClick={() => handleStackSelect(stack.value)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-mono shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {stack.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE FILTER SLIDE-OVER DRAWER MODAL                                  */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="text-base font-bold text-foreground font-display">
                  Filters & Sorting
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Sort Order</label>
              <CustomSelect
                value={selectedSort}
                onChange={handleSortChange}
                options={SORT_OPTIONS}
              />
            </div>

            {/* Saved Toggle */}
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <Bookmark className={`h-4 w-4 ${showSavedOnly ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium text-foreground">
                    Saved Blueprints Only
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showSavedOnly}
                  onChange={e => setShowSavedOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary cursor-pointer"
                />
              </label>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Tech Stack</label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_STACKS.map(stack => {
                  const isSelected = selectedStack === stack.value;
                  return (
                    <button
                      key={stack.value}
                      type="button"
                      onClick={() => handleStackSelect(stack.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'border border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {stack.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleResetAll}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN GALLERY CONTENT (Right Column)                                   */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0">
        {/* Active Filter Chips (shown only when filters are active) */}
        {activeFiltersCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-primary cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedStack !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                <span>Stack: {selectedStack}</span>
                <button
                  type="button"
                  onClick={() => handleStackSelect('All')}
                  className="hover:text-primary cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedSort !== 'newest' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                <span>
                  Sort: {SORT_OPTIONS.find(o => o.value === selectedSort)?.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleSortChange('newest')}
                  className="hover:text-primary cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {showSavedOnly && (
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                <span>Saved Only</span>
                <button
                  type="button"
                  onClick={() => setShowSavedOnly(false)}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetAll}
              className="text-[11px] text-muted-foreground hover:text-foreground underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Blueprint Cards Grid */}
        {displayedBlueprints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayedBlueprints.map(bp => (
              <BlueprintCard
                key={bp._id}
                blueprint={bp}
                isBookmarkedInitial={savedIds.includes(bp._id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 sm:p-16 text-center max-w-md mx-auto space-y-4 my-8">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-muted text-foreground border border-border flex items-center justify-center">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground font-display">
                No Blueprints Found
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {showSavedOnly
                  ? 'You have not bookmarked any blueprints matching this criteria yet.'
                  : 'No architecture blueprints match your active keyword or tech stack filter.'}
              </p>
            </div>
            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mt-8">
          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
