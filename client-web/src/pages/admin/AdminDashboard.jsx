import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { FiUsers, FiTool, FiCalendar, FiAlertTriangle, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useNotification();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        showToast('Admin data fetch failed', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      showToast(res.message, 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: !u.isVerified } : u))
      );
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-500">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Control Center</h1>
        <p className="text-sm text-slate-500 mt-1">Manage users, moderations, categories, and platform health.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-primary">
            <span className="text-xs font-bold uppercase">Total Users</span>
            <FiUsers className="text-2xl" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 0}</div>
        </div>

        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase">Tools Listed</span>
            <FiTool className="text-2xl" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.toolsListed || 0}</div>
        </div>

        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold uppercase">Bookings</span>
            <FiCalendar className="text-2xl" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalBookings || 0}</div>
        </div>

        <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold uppercase">Est. Platform Volume</span>
            <FiDollarSign className="text-2xl" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.revenuePlaceholder || '$0'}</div>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Registered Users ({users.length})</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.isVerified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {u.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleUser(u._id)}
                      className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300"
                    >
                      Toggle Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
