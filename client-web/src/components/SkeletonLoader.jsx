import React from 'react';

const SkeletonLoader = ({ count = 3, type = "card" }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl glassmorphism p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
