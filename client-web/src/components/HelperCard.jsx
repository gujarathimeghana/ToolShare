import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiMessageSquare } from 'react-icons/fi';
import RatingStars from './RatingStars';
import UserAvatar from './UserAvatar';

const HelperCard = ({ helper }) => {
  return (
    <div className="rounded-3xl glassmorphism border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
      <div>
        <div className="flex items-start gap-4">
          <UserAvatar name={helper.name} avatarUrl="" size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white truncate">{helper.name}</h3>
              <FiCheckCircle className="text-emerald-500 text-base shrink-0" title="Verified Helper" />
            </div>
            <RatingStars rating={helper.rating} count={helper.reviewCount} />
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
              <FiMapPin className="text-indigo-500" /> {helper.location?.address || 'Local Neighborhood'}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 italic leading-relaxed">
          "{helper.bio || 'Available for plumbing, electrical work, and general household tasks.'}"
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {helper.helperSkills?.map((skill, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xl font-black text-slate-900 dark:text-white">${helper.hourlyRate || 30}</span>
          <span className="text-xs text-slate-500 font-bold"> / hr</span>
        </div>
        <Link
          to={`/dashboard/chat?recipient=${helper._id}`}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-gradient text-white text-xs font-bold shadow-md hover:scale-105 transition-transform"
        >
          <FiMessageSquare /> Hire / Chat
        </Link>
      </div>
    </div>
  );
};

export default HelperCard;
