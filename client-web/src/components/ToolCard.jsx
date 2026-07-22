import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiShield, FiTag } from 'react-icons/fi';
import RatingStars from './RatingStars';
import UserAvatar from './UserAvatar';

const ToolCard = ({ tool, onFavoriteToggle, isFavorite = false }) => {
  const ownerName = tool.owner?.name || 'Neighbor';

  return (
    <div className="group rounded-3xl glassmorphism border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
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
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-colors shadow-md backdrop-blur-md"
          >
            <FiHeart className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
          {tool.condition && (
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              {tool.condition}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              {tool.category?.name || 'Tool'}
            </span>
            <RatingStars rating={tool.rating} count={tool.reviewCount} />
          </div>

          <Link to={`/tools/${tool._id}`} className="block">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {tool.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <UserAvatar name={ownerName} avatarUrl="" size="sm" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">{ownerName}</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <FiMapPin className="text-indigo-500" />
              <span className="truncate max-w-[90px]">{tool.location?.address || 'NYC'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Pricing */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">${tool.pricePerDay}</span>
          <span className="text-xs text-slate-500 font-bold"> / day</span>
        </div>
        <Link
          to={`/tools/${tool._id}`}
          className="px-4 py-2.5 rounded-xl text-xs font-black text-white btn-gradient shadow-md hover:scale-105 transition-transform"
        >
          Borrow Tool
        </Link>
      </div>
    </div>
  );
};

export default ToolCard;
