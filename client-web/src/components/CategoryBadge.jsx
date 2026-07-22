import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBadge = ({ category }) => {
  return (
    <Link
      to={`/tools?category=${category._id}`}
      className="flex items-center gap-3 p-4 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
        ⚡
      </div>
      <div>
        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
          {category.name}
        </h4>
        <span className="text-xs text-slate-500 font-medium">{category.itemCount || 0} listings</span>
      </div>
    </Link>
  );
};

export default CategoryBadge;
