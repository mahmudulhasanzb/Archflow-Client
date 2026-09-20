'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { rateBlueprintAction, getUserRatingAction } from '@/lib/api/blueprint/action';
import { authClient } from '@/lib/auth-client';
import AuthPromptModal from '@/components/blueprint/AuthPromptModal';

interface RatingWidgetProps {
  blueprintId: string;
  initialRating?: number;
  initialCount?: number;
}

export default function RatingWidget({
  blueprintId,
  initialRating = 5,
  initialCount = 1,
}: RatingWidgetProps) {
  const { data: session } = authClient.useSession();

  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState(initialCount);
  const [hasRated, setHasRated] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if current authenticated user has already rated
  useEffect(() => {
    if (!session?.user || !blueprintId) {
      setHasRated(false);
      setUserRating(null);
      return;
    }
    let isMounted = true;
    getUserRatingAction(blueprintId)
      .then(res => {
        if (isMounted && res?.hasRated) {
          setHasRated(true);
          setUserRating(res.userRating);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [blueprintId, session?.user]);

  const handleRate = async (starValue: number) => {
    if (isSubmitting) return;

    // Must be logged in to rate
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    // Each user can only rate once
    if (hasRated) {
      toast('You have already rated this blueprint', { icon: 'ℹ️' });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await rateBlueprintAction(blueprintId, starValue);
      if (data?.success) {
        setRating(data.rating);
        setRatingsCount(data.ratingsCount);
        setHasRated(true);
        setUserRating(starValue);
        toast.success(`Rated ${starValue} / 5 stars!`);
      } else {
        toast.error(data?.error || 'Failed to submit rating');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Could not save rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating !== null && !hasRated ? hoverRating : rating;

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-0.5"
          title={hasRated ? `You already rated ${userRating} ★` : 'Click to rate (1-5 stars)'}
        >
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              disabled={isSubmitting || hasRated}
              onClick={() => handleRate(star)}
              onMouseEnter={() => !hasRated && setHoverRating(star)}
              onMouseLeave={() => !hasRated && setHoverRating(null)}
              aria-label={`Rate ${star} stars`}
              className={`p-0.5 rounded transition-transform ${
                hasRated
                  ? 'cursor-default opacity-90'
                  : 'hover:scale-125 focus:outline-none cursor-pointer'
              }`}
            >
              <Star
                className={`h-3.5 w-3.5 transition-colors ${
                  star <= Math.round(displayRating)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-foreground">
          {rating.toFixed(1)}
        </span>
        {ratingsCount > 0 && (
          <span className="text-[10px] text-muted-foreground">
            ({ratingsCount} {ratingsCount === 1 ? 'review' : 'reviews'})
          </span>
        )}
        {hasRated && (
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"
            title={`You rated this blueprint ${userRating} stars`}
          >
            <Check className="h-2.5 w-2.5" />
            Rated
          </span>
        )}
      </div>

      {/* Guest Authentication Modal for Rating */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to rate blueprint"
        description="Please log in or create an account to rate this architecture blueprint and help others discover quality specs."
        actionText="Sign In to Rate"
        icon={<Star className="h-6 w-6 fill-amber-500 text-amber-500" />}
        iconBadgeClassName="bg-amber-500/10 text-amber-500 border-amber-500/20"
      />
    </>
  );
}
