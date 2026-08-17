import React from 'react';
import { FiStar } from 'react-icons/fi';

const RatingStars = ({ rating = 0, count = 0, size = "text-sm", showCount = true }) => {
  const numRating = Number(rating) || 0;
  const numCount = Number(count) || 0;

  if (numCount === 0 && numRating === 0) {
    return (
      <div className="flex items-center gap-1">
        <FiStar className={`${size} text-slate-300 dark:text-slate-600`} />
        <span className={`font-semibold ${size} text-slate-500 dark:text-slate-400`}>
          No reviews yet
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <FiStar className={`${size} text-amber-400 fill-amber-400`} />
      <span className={`font-extrabold ${size} text-slate-800 dark:text-slate-200`}>
        {numRating.toFixed(1)}
      </span>
      {showCount && (
        <span className="text-xs text-slate-500 font-semibold">
          ({numCount} {numCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
