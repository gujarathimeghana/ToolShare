import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import UserAvatar from '../../components/UserAvatar';
import api from '../../services/api';
import { FiUser, FiPhone, FiFileText, FiDollarSign, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();

  const loc = user?.location || {};
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(loc.city || 'New York');
  const [area, setArea] = useState(loc.area || 'Manhattan');
  const [state, setState] = useState(loc.state || 'NY');
  const [pincode, setPincode] = useState(loc.pincode || '');
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
        city,
        area,
        state,
        pincode,
        isHelper,
        hourlyRate
      });
      updateUser(res.data);
      showToast('Profile and manual location updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl glassmorphism border border-slate-200/80 dark:border-slate-800/80 space-y-8 shadow-xl">
      {/* Profile Header Badge */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-500/10 border border-indigo-500/20">
        <UserAvatar name={user?.name || name || 'User'} avatarUrl="" size="xl" />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name || 'Neighbor'}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <FiCheckCircle className="w-3.5 h-3.5" /> Verified Neighbor
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{user?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1">
            <FiMapPin className="text-indigo-500" />
            <span>Location: {loc.address || [area, city, state].filter(Boolean).join(', ')}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            <FiUser className="w-4 h-4 text-indigo-500" /> Full Account Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            <FiPhone className="w-4 h-4 text-emerald-500" /> Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Manual Location Fields */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <FiMapPin className="text-indigo-500" /> Manual Location Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Area / Locality</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Manhattan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. NY"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">PIN Code (Optional)</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 10001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            <FiFileText className="w-4 h-4 text-amber-500" /> Neighborhood Bio & Skills
          </label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
          ></textarea>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="helperCheck"
              checked={isHelper}
              onChange={(e) => setIsHelper(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="helperCheck" className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer">
              Offer Services as a Skilled Helper in Neighborhood
            </label>
          </div>

          {isHelper && (
            <div className="pl-8 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                <FiDollarSign className="w-4 h-4 text-emerald-500" /> Hourly Rate ($)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 px-6 rounded-xl font-bold text-white btn-gradient shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01]">
          {loading ? 'Saving Changes...' : 'Update Account Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
