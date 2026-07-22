import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiMail, FiLock, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      showToast('Welcome back to Neighborly!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await googleLogin({
        email: 'user.google@neighborly.app',
        name: 'Neighbor User',
        googleId: 'google_' + Date.now()
      });
      showToast('Google Sign-in successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Google auth failed', 'error');
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Animated 3D Mesh Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* 3D Glassmorphism Card */}
      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl glassmorphism-3d border border-indigo-500/30 dark:border-indigo-400/20 shadow-2xl space-y-6 card-3d-hover">
        {/* Header Logo Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-500/30 border border-white/20 transform hover:rotate-6 transition-transform">
            N
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Sign In to <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Neighborly</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Borrow tools & hire skilled helpers in your neighborhood
            </p>
          </div>
        </div>

        {/* Social Auth */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-slate-100 dark:bg-slate-900 px-4 text-[11px] font-black text-slate-400 dark:text-slate-500 rounded-full border border-slate-200 dark:border-slate-800 absolute">
            OR WITH EMAIL
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-inner">
              <FiMail className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-inner">
              <FiLock className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-white text-base btn-gradient flex items-center justify-center gap-2 group shadow-xl"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
            <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-200/60 dark:border-slate-800/60">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-black text-indigo-600 dark:text-indigo-400 hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
