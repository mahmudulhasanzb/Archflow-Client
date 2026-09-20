'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Eye,
  Download,
  ShieldCheck,
  LogIn,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import {
  incrementViewAction,
  toggleBookmarkAction,
  getUserBookmarksAction,
} from '@/lib/api/blueprint/action';
import RatingWidget from '@/components/blueprint/RatingWidget';
import AuthPromptModal from '@/components/blueprint/AuthPromptModal';

interface BlueprintHeaderProps {
  blueprint: {
    _id: string;
    title: string;
    description?: string;
    prompt?: string;
    teckStack?: string[] | string;
    stack?: string;
    author?: string;
    creatorId?: string;
    createdAt?: string;
    Date?: string;
    views?: number;
    downloads?: number;
    rating?: number;
    ratings?: number[];
    ratingsCount?: number;
    visibility?: 'public' | 'private';
  };
}

export default function BlueprintHeader({ blueprint }: BlueprintHeaderProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewsCount, setViewsCount] = useState(blueprint.views ?? 0);

  const id = String(blueprint._id);
  const viewTrackedRef = useRef(false);

  // Automatically track view telemetry once on mount
  useEffect(() => {
    if (!viewTrackedRef.current && id) {
      viewTrackedRef.current = true;
      incrementViewAction(id).then(res => {
        if (res?.views) {
          setViewsCount(res.views);
        }
      }).catch(() => {});
    }
  }, [id]);

  // Load bookmark status from DB for authenticated user
  useEffect(() => {
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
  }, [id, session?.user]);

  // Normalize Tech Stack into individual tags
  let stackItems: string[] = [];
  if (blueprint.teckStack) {
    if (Array.isArray(blueprint.teckStack)) {
      stackItems = blueprint.teckStack;
    } else if (typeof blueprint.teckStack === 'string') {
      const raw = blueprint.teckStack;
      stackItems = raw.includes('+')
        ? raw.split('+').map(s => s.trim())
        : raw.split(',').map(s => s.trim());
    }
  } else if (blueprint.stack) {
    const raw = blueprint.stack;
    stackItems = raw.includes('+')
      ? raw.split('+').map(s => s.trim())
      : raw.split(',').map(s => s.trim());
  }
  stackItems = stackItems.filter(Boolean);
  if (stackItems.length === 0) stackItems = ['TypeScript', 'Architecture'];

  // Author identity formatting
  const rawAuthor = blueprint.author || 'Verified Architect';
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

  const createdDate = blueprint.createdAt || blueprint.Date;
  const timeAgo = formatTimeAgo(createdDate);
  const formattedFullDate = createdDate ? new Date(createdDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';

  // Toggle bookmark logic
  const handleBookmarkToggle = async () => {
    if (!session?.user) {
      setIsBookmarked(false);
      setShowAuthModal(true);
      return;
    }

    const previousState = isBookmarked;
    const nextState = !previousState;

    setIsBookmarked(nextState);

    try {
      const res = await toggleBookmarkAction(id);
      if (res?.success && res.isBookmarked !== undefined) {
        setIsBookmarked(res.isBookmarked);
        toast.success(res.isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
      } else {
        setIsBookmarked(previousState);
        toast.error('Unable to update bookmark');
      }
    } catch {
      setIsBookmarked(previousState);
      toast.error('Unable to update bookmark');
    }
  };

  return (
    <>
      <div className="space-y-3.5 pb-4 border-b border-border w-full min-w-0">
        {/* Navigation Breadcrumb & Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 w-full">
          <Link
            href="/blueprints"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-border/60 hover:border-border bg-card/60 hover:bg-muted/60 transition-all"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Explore</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Bookmark Action Button */}
            <button
              type="button"
              onClick={handleBookmarkToggle}
              title={isBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                  : 'border-border/60 bg-card hover:bg-muted text-foreground'
              }`}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title, Description & Tech Stack Pills */}
        <div className="space-y-2.5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              {blueprint.title}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl line-clamp-2">
              {blueprint.description || blueprint.prompt || 'Production system architecture specification.'}
            </p>
          </div>

          {/* Individual Tech Stack Pills */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {stackItems.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-foreground/90 border border-border hover:border-primary/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Author, Timestamp, and Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-muted-foreground">
          {/* Author Identity & Date */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary/80 to-primary text-[10px] font-bold text-primary-foreground shadow-xs">
                {authorInitial}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-foreground capitalize">
                  {authorName}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                  <ShieldCheck className="h-2.5 w-2.5" /> Architect
                </span>
                {timeAgo && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span
                      className="text-muted-foreground cursor-help"
                      title={`Created on ${formattedFullDate}`}
                    >
                      Published {timeAgo}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry Metrics & Rating */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
            {/* Views Metric */}
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              title={`${viewsCount} total views`}
            >
              <Eye className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{viewsCount.toLocaleString()} {viewsCount === 1 ? 'view' : 'views'}</span>
            </div>

            {/* Downloads Metric */}
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              title={`${blueprint.downloads ?? 0} suite downloads`}
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{(blueprint.downloads ?? 0).toLocaleString()} {blueprint.downloads === 1 ? 'download' : 'downloads'}</span>
            </div>

            {/* Dynamic Rating Widget */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-border">
              <span className="text-[10px] font-semibold text-muted-foreground hidden sm:inline">
                Rating:
              </span>
              <RatingWidget
                blueprintId={id}
                initialRating={typeof blueprint.rating === 'number' ? blueprint.rating : 5}
                initialCount={blueprint.ratingsCount || blueprint.ratings?.length || 1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Authentication Modal for Bookmarking */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to save blueprint"
        description="Create a free account or sign in to bookmark this architecture specification and access it anytime from your dashboard."
        actionText="Sign In / Register"
        icon={<Bookmark className="h-6 w-6" />}
        iconBadgeClassName="bg-primary/10 text-primary border-primary/20"
        redirectPath={`/blueprints/${id}`}
      />
    </>
  );
}
