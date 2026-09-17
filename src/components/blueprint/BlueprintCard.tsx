'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ArrowRight,
  Eye,
  Download,
  Bookmark,
  BookmarkCheck,
  X,
  LogIn,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SpotlightCard from '@/components/ui/SpotlightCard';
import {
  incrementViewAction,
  toggleBookmarkAction,
  getUserBookmarksAction,
} from '@/lib/api/blueprint/action';
import { authClient } from '@/lib/auth-client';

export interface Blueprint {
  _id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  prompt?: string;
  stack?: string;
  teckStack?: string | string[];
  complexity?: string;
  complexcity?: string;
  rating?: number;
  ratings?: number[];
  ratingsCount?: number;
  views?: number;
  downloads?: number;
  visibility?: 'public' | 'private';
  status?: string;
  createdAt?: string;
  Date?: string;
  author?: string;
  creatorId?: string;
}

export interface BlueprintCardProps {
  blueprint: Blueprint;
  isBookmarkedInitial?: boolean;
  onBookmarkToggle?: (blueprintId: string, isSaved: boolean) => void;
}

export default function BlueprintCard({
  blueprint,
  isBookmarkedInitial,
  onBookmarkToggle,
}: BlueprintCardProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isBookmarked, setIsBookmarked] = useState(Boolean(isBookmarkedInitial));
  const [showAuthModal, setShowAuthModal] = useState(false);

  const id = blueprint._id;
  const title = blueprint.title || 'Untitled Blueprint';
  const description =
    blueprint.shortDescription ||
    blueprint.description ||
    blueprint.prompt ||
    'Production system architecture specification.';
  const rating = blueprint.rating || 4.8;
  const views = blueprint.views ?? 0;
  const downloads = blueprint.downloads ?? 0;

  // Author identity formatting
  const rawAuthor = blueprint.author || 'Architect';
  const authorName = rawAuthor.includes('@')
    ? rawAuthor.split('@')[0]
    : rawAuthor;
  const authorInitial = authorName.charAt(0).toUpperCase() || 'A';

  // Calculate relative time ago
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;

    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  };

  const createdTimeAgo = formatTimeAgo(blueprint.createdAt || blueprint.Date);

  // Sync isBookmarked state from prop
  useEffect(() => {
    if (isBookmarkedInitial !== undefined) {
      setIsBookmarked(Boolean(isBookmarkedInitial));
    }
  }, [isBookmarkedInitial]);

  // If standalone and isBookmarkedInitial not provided, fetch from DB
  useEffect(() => {
    if (isBookmarkedInitial !== undefined) return;
    if (!session?.user) {
      setIsBookmarked(false);
      return;
    }
    let isMounted = true;
    getUserBookmarksAction()
      .then(res => {
        if (isMounted && res?.success && Array.isArray(res.bookmarkIds)) {
          setIsBookmarked(res.bookmarkIds.includes(id));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [id, session?.user, isBookmarkedInitial]);

  // Normalized tech stack
  let stackItems: string[] = [];
  if (blueprint.teckStack) {
    stackItems = Array.isArray(blueprint.teckStack)
      ? blueprint.teckStack
      : blueprint.teckStack.split(',').map(s => s.trim());
  } else if (blueprint.stack) {
    stackItems = blueprint.stack.split(',').map(s => s.trim());
  }
  if (stackItems.length === 0) stackItems = ['TypeScript', 'Next.js'];

  // Track view count when user clicks card or view link
  const handleViewClick = () => {
    if (id) {
      incrementViewAction(id);
    }
  };

  // Toggle bookmark logic (Database backed)
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If user not signed in, trigger login modal
    if (!session?.user) {
      setIsBookmarked(false);
      setShowAuthModal(true);
      return;
    }

    const previousState = isBookmarked;
    const nextState = !previousState;

    // Optimistic UI update
    setIsBookmarked(nextState);
    onBookmarkToggle?.(id, nextState);

    try {
      const res = await toggleBookmarkAction(id);
      if (res?.success && res.isBookmarked !== undefined) {
        setIsBookmarked(res.isBookmarked);
        onBookmarkToggle?.(id, res.isBookmarked);
        toast.success(res.isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
      } else {
        // Revert on error
        setIsBookmarked(previousState);
        onBookmarkToggle?.(id, previousState);
        toast.error('Unable to update bookmark');
      }
    } catch {
      setIsBookmarked(previousState);
      onBookmarkToggle?.(id, previousState);
      toast.error('Unable to update bookmark');
    }
  };

  const handleNavigateToLogin = () => {
    setShowAuthModal(false);
    router.push(`/signin?callbackUrl=/blueprints/${id}`);
  };

  return (
    <>
      <SpotlightCard className="h-full group hover:border-foreground/30 transition-all duration-200">
        <div className="relative flex flex-col h-full p-4 sm:p-5 justify-between gap-3">
          {/* Top Header Row: Author Info (Left) + Bookmark Button (Right) */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Author Avatar + Name */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary/80 to-primary text-[11px] font-bold text-primary-foreground shadow-xs">
                {authorInitial}
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-semibold text-foreground truncate capitalize">
                  {authorName}
                </span>
                {createdTimeAgo && (
                  <span className="text-[10px] text-muted-foreground">
                    {createdTimeAgo}
                  </span>
                )}
              </div>
            </div>

            {/* Bookmark Action Button */}
            <button
              type="button"
              onClick={handleBookmarkToggle}
              aria-label={
                isBookmarked ? 'Remove bookmark' : 'Bookmark blueprint'
              }
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 fill-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>
          {/* Clickable Middle Body */}
          <Link
            href={`/blueprints/${id}`}
            onClick={handleViewClick}
            className="flex flex-col flex-1 justify-between gap-3 focus:outline-none group/body"
          >
            {/* Body: Title & Description */}
            <div className="space-y-1.5">
              <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-foreground font-display group-hover/body:text-primary transition-colors leading-snug">
                {title}
              </h3>
              <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Tech Stack Pills (Compact) */}
            <div className="relative z-10 flex flex-wrap items-center gap-1.5 pt-0.5">
              {stackItems.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {stackItems.length > 3 && (
                <span className="rounded-md border border-border bg-muted/20 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground/80">
                  +{stackItems.length - 3}
                </span>
              )}
            </div>
          </Link>
          {/* Bottom Footer: Stats (Rating, Views, Downloads) + Action */}
          <div className="relative z-10 flex items-center justify-between border-t border-border pt-3 mt-1 text-[11px] text-muted-foreground">
            {/* Stats cluster */}
            <div className="flex items-center gap-2.5">
              {/* Rating */}
              <div
                className="flex items-center gap-1 text-foreground"
                title="Rating"
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-mono font-bold">
                  {Number(rating).toFixed(1)}
                </span>
              </div>

              {/* Views Count */}
              <div className="flex items-center gap-1" title="Total Views">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono">{views}</span>
              </div>

              {/* Downloads Count */}
              <div className="flex items-center gap-1" title="Suite Downloads">
                <Download className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono">{downloads}</span>
              </div>
            </div>

            {/* View CTA */}
            <Link
              href={`/blueprints/${id}`}
              onClick={handleViewClick}
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary/80 transition-colors"
            >
              <span>View Blueprint</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </SpotlightCard>

      {/* Simple Guest Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAuthModal(false)}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
            {/* Top-right Close Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header & Content */}
            <div className="mt-4 flex flex-col items-center text-center space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Bookmark className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground font-display">
                  Save Blueprint
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Please log in to save and collect blueprints to your personal
                  workspace.
                </p>
              </div>

              {/* Login Button */}
              <div className="pt-3 w-full">
                <button
                  type="button"
                  onClick={handleNavigateToLogin}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Log In to Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
