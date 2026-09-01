import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number; // 0 to 5
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showScore?: boolean;
  className?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: '差強人意',
  2: '尚可一試',
  3: '家常美味',
  4: '相當好吃',
  5: '絕品神作！',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = false,
  showScore = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starValue: number) => {
    if (readOnly || !onChange) return;
    // If clicking the current rating, allow clearing to 0
    if (rating === starValue) {
      onChange(0);
    } else {
      onChange(starValue);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => !readOnly && setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = activeRating >= starValue;
          return (
            <button
              key={starValue}
              type="button"
              disabled={readOnly}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => !readOnly && setHoverRating(starValue)}
              className={`p-0.5 rounded transition-transform ${
                readOnly
                  ? 'cursor-default'
                  : 'hover:scale-110 active:scale-95 cursor-pointer focus:outline-none'
              }`}
              title={readOnly ? `${rating} 顆星` : `評分 ${starValue} 顆星 (${RATING_LABELS[starValue]})`}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 stroke-amber-500'
                    : 'fill-stone-100 text-stone-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showScore && rating > 0 && (
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          {rating}.0
        </span>
      )}

      {showLabel && (
        <span className="text-xs font-medium text-stone-500 min-w-[4rem]">
          {activeRating > 0 ? (
            <span className="text-amber-700 font-semibold">
              {RATING_LABELS[activeRating]}
            </span>
          ) : (
            <span className="text-stone-400">點擊評分</span>
          )}
        </span>
      )}
    </div>
  );
};
