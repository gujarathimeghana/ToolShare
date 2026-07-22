import React from 'react';
import { FiSearch, FiCalendar, FiCheckCircle, FiSmile } from 'react-icons/fi';

const HowItWorksPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">How Neighborly Works</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Borrowing or lending a tool takes less than 2 minutes. Follow these simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">1</div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Search & Filter</h3>
          <p className="text-xs text-slate-500">Search for tools or helpers within your 5 km radius.</p>
        </div>

        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl font-bold">2</div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Request Rental</h3>
          <p className="text-xs text-slate-500">Select dates and choose Cash on Pickup or Pay Later.</p>
        </div>

        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl font-bold">3</div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pickup & Use</h3>
          <p className="text-xs text-slate-500">Meet your neighbor, inspect the tool, and complete your project.</p>
        </div>

        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl font-bold">4</div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Return & Review</h3>
          <p className="text-xs text-slate-500">Return the tool safely and leave a review for the community.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
