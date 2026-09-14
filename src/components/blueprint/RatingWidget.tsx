'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { rateBlueprintAction } from '@/lib/api/blueprint/action';

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
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState(initialCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (starValue: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await rateBlueprintAction(blueprintId, starValue);
      if (data?.success) {
        setRating(data.rating);
        setRatingsCount(data.ratingsCount);
        toast.success(`Rated ${starValue} / 5 stars!`);
      } else {
        throw new Error(data?.error || 'Failed to submit rating');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Could not save rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            aria-label={`Rate ${star} stars`}
            className="p-0.5 rounded transition-transform hover:scale-125 focus:outline-none cursor-pointer"
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                star <= displayRating
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs font-bold text-[#181B20] dark:text-[#F3F4F6]">
        {rating.toFixed(1)}
      </span>
      {ratingsCount > 0 && (
        <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
          ({ratingsCount} {ratingsCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
