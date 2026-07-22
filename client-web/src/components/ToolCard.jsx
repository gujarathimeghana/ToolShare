import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiShield, FiTag } from 'react-icons/fi';
import RatingStars from './RatingStars';

const ToolCard = ({ tool, onFavoriteToggle, isFavorite = false }) => {
  return (
    <div className="group rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={tool.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'}
            alt={tool.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={() => onFavoriteToggle && onFavoriteToggle(tool._id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-colors shadow-md"
          >
            <FiHeart className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
          {tool.condition && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold">
              {tool.condition}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {tool.category?.name || 'Tool'}
            </span>
            <RatingStars rating={tool.rating} count={tool.reviewCount} />
          </div>

          <Link to={`/tools/${tool._id}`} className="block">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 mb-4">
            {tool.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiMapPin className="text-primary" />
            <span className="truncate">{tool.location?.address || 'Local Neighborhood'}</span>
          </div>
        </div>
      </div>

      {/* Footer / Pricing */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">${tool.pricePerDay}</span>
          <span className="text-xs text-slate-500 font-medium"> / day</span>
        </div>
        <Link
          to={`/tools/${tool._id}`}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white btn-gradient"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ToolCard;
