import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiTool, FiCalendar, FiHeart, FiMessageSquare, FiSettings, FiPlusCircle } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: <FiGrid /> },
    { label: 'My Tool Listings', path: '/dashboard/listings', icon: <FiTool /> },
    { label: 'My Borrowed Tools', path: '/dashboard/bookings', icon: <FiCalendar /> },
    { label: 'Saved Favorites', path: '/dashboard/favorites', icon: <FiHeart /> },
    { label: 'Messages & Chat', path: '/dashboard/chat', icon: <FiMessageSquare /> },
    { label: 'Profile & Settings', path: '/dashboard/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          {/* User Brief */}
          <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-20 h-20 mx-auto rounded-2xl object-cover border-2 border-primary/30"
            />
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <Link
              to="/dashboard/add-tool"
              className="w-full py-2.5 rounded-xl font-bold text-white text-xs btn-gradient flex items-center justify-center gap-1.5"
            >
              <FiPlusCircle /> List New Tool
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-1">
            {navItems.map((item, idx) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
