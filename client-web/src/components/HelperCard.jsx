import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import RatingStars from './RatingStars';

const HelperCard = ({ helper }) => {
  return (
    <div className="rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
      <div>
        <div className="flex items-start gap-4">
          <img
            src={helper.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={helper.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{helper.name}</h3>
              <FiCheckCircle className="text-secondary text-base shrink-0" title="Verified Helper" />
            </div>
            <RatingStars rating={helper.rating} count={helper.reviewCount} />
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
              <FiMapPin className="text-primary" /> {helper.location?.address || 'Local Neighborhood'}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 italic">
          "{helper.bio || 'Available for plumbing, electrical work, and general household tasks.'}"
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {helper.helperSkills?.map((skill, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">${helper.hourlyRate || 30}</span>
          <span className="text-xs text-slate-500"> / hr</span>
        </div>
        <Link
          to={`/dashboard/chat?recipient=${helper._id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors"
        >
          <FiMessageSquare /> Hire / Chat
        </Link>
      </div>
    </div>
  );
};

export default HelperCard;
