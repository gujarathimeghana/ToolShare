import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      showToast('Password reset link sent to your email!', 'success');
    } catch (err) {
      showToast(err.message || 'Request failed', 'error');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">Reset Password</h2>
        <p className="text-xs text-slate-500 text-center">Enter your email and we'll send reset instructions.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          />
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white btn-gradient">
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-xs text-slate-500">
          Remember password? <Link to="/login" className="text-primary font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
