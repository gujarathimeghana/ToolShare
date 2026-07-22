import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Borrowed & Lent Bookings</h2>
        <p className="text-xs text-slate-500 mt-1">Track rental requests, active tool loans, and return status.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="font-bold text-slate-700 dark:text-slate-300">No active or past bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="p-6 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{b.tool?.title || 'Tool'}</h4>
                <p className="text-xs text-slate-500">
                  Dates: {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                    Status: {b.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                    ${b.totalPrice} ({b.paymentOption})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
