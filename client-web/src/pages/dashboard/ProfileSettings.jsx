import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isHelper, setIsHelper] = useState(user?.isHelper || false);
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 30);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        bio,
        isHelper,
        hourlyRate
      });
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-6">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile & Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio / Skills Summary</label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
          ></textarea>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="helperCheck"
            checked={isHelper}
            onChange={(e) => setIsHelper(e.target.checked)}
            className="w-4 h-4 rounded text-primary"
          />
          <label htmlFor="helperCheck" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Register as a Local Skilled Helper
          </label>
        </div>

        {isHelper && (
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Hourly Rate ($)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="py-3 px-6 rounded-xl font-bold text-white btn-gradient">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
