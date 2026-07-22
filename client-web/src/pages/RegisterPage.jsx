import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Name, email, and password are required', 'error');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim(),
        phone: phone.trim(),
        location: {
          type: 'Point',
          coordinates: [-73.935242, 40.73061],
          address: address.trim() || 'New York, NY'
        }
      });
      showToast('Registration successful! Welcome to Neighborly.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Animated Mesh Gradient Blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* 3D Glassmorphism Card */}
      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl glassmorphism-3d border border-indigo-500/30 dark:border-indigo-400/20 shadow-2xl space-y-6 card-3d-hover">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-500/30 border border-white/20 transform hover:-rotate-6 transition-transform">
            N
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Join your hyper-local neighborhood tool sharing marketplace
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
              <FiUser className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
              <FiMail className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
              <FiLock className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="password"
                placeholder="Create a strong password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Phone Number
            </label>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
              <FiPhone className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              City / Neighborhood
            </label>
            <div className="flex items-center px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
              <FiMapPin className="text-indigo-500 text-lg mr-3 shrink-0" />
              <input
                type="text"
                placeholder="e.g. Brooklyn, NY"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-white text-base btn-gradient flex items-center justify-center gap-2 group shadow-xl"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
            <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-200/60 dark:border-slate-800/60">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
