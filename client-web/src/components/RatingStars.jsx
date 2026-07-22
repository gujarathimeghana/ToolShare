import React from 'react';
import { FiStar } from 'react-icons/fi';

const RatingStars = ({ rating = 5.0, count = 0, size = "text-sm" }) => {
  return (
    <div className="flex items-center gap-1">
      <FiStar className={`${size} text-amber-400 fill-amber-400`} />
      <span className={`font-bold ${size} text-slate-800 dark:text-slate-200`}>
        {Number(rating).toFixed(1)}
      </span>
      {count > 0 && (
        <span className="text-xs text-slate-500 font-normal">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
