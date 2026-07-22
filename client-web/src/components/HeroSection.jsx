import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShield, FiUsers, FiClock, FiRepeat } from 'react-icons/fi';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/tools?search=${encodeURIComponent(searchTerm)}&category=${category}`);
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 animate-pulse">
          <span>✨ Hyper-local Community Marketplace</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Borrow Tools. Hire Helpers.{' '}
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            Empower Your Neighborhood.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
          Why buy expensive tools for one-time tasks? Connect with verified neighbors nearby to borrow drills, ladders, mowers, or hire skilled local hands.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSearch} className="mt-10 max-w-3xl mx-auto p-2 sm:p-3 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-3 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
            <FiSearch className="text-slate-400 text-lg mr-2" />
            <input
              type="text"
              placeholder="What tool or help do you need? (e.g. Cordless Drill, Plumber)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="flex items-center px-3 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl sm:w-48">
            <FiMapPin className="text-primary text-lg mr-2" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">Nearby (5 km)</span>
          </div>

          <button
            type="submit"
            className="py-3 px-8 rounded-xl font-bold text-white text-sm btn-gradient shrink-0"
          >
            Search Nearby
          </button>
        </form>

        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800/60">
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">10,000+</div>
            <div className="text-xs text-slate-500 font-medium">Tools Shared</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">4,500+</div>
            <div className="text-xs text-slate-500 font-medium">Verified Helpers</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">$150,000+</div>
            <div className="text-xs text-slate-500 font-medium">Saved by Neighbors</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">4.9★</div>
            <div className="text-xs text-slate-500 font-medium">Community Trust Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
