import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiBell, FiPlusCircle, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from './UserAvatar';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Refresh notifications every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.success) {
        setNotifications(res.data.data || []);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 glassmorphism border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
              Neighborly
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/tools" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Browse Tools
            </Link>
            <Link to="/helpers" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Find Helpers
            </Link>
            <Link to="/categories" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Categories
            </Link>
            <Link to="/how-it-works" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How it Works
            </Link>
          </div>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun className="text-amber-400 text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (unreadCount > 0) markAllRead();
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
                    title="Notifications"
                  >
                    <FiBell className="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Notifications</h4>
                        <span className="text-xs text-indigo-500 font-bold">{notifications.length} total</span>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                                n.read
                                  ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                                  : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/dashboard/add-tool"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-extrabold text-white btn-gradient shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform"
                >
                  <FiPlusCircle className="text-lg" /> List a Tool
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <UserAvatar name={user?.name || 'User'} avatarUrl="" size="sm" />
                  <span className="text-sm font-extrabold max-w-[120px] truncate text-slate-800 dark:text-slate-100">{user?.name}</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-xs border border-amber-500/20 hover:bg-amber-500/20"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-extrabold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-extrabold text-white btn-gradient shadow-md shadow-indigo-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <FiSun className="text-amber-400" /> : <FiMoon />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 text-2xl"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism px-4 pt-2 pb-6 space-y-3 border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600"
          >
            Browse Tools
          </Link>
          <Link
            to="/helpers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600"
          >
            Find Helpers
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600"
          >
            Categories
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <Link
                to="/dashboard/add-tool"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl font-extrabold text-white btn-gradient"
              >
                + List a Tool
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 text-base font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600"
              >
                <UserAvatar name={user?.name || 'User'} avatarUrl="" size="sm" />
                Dashboard ({user?.name})
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-bold text-amber-500"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-base font-bold text-rose-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-base font-bold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl font-extrabold text-white btn-gradient"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
