import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { FiCheckCircle, FiXCircle, FiClock, FiUser, FiCalendar, FiMapPin, FiPhone } from 'react-icons/fi';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'sent'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useNotification();

  const fetchBookings = async () => {
    try {
      const role = activeTab === 'incoming' ? 'owner' : 'renter';
      const res = await api.get(`/bookings?role=${role}`);
      setBookings(res.data);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      showToast('Failed to load tool requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleUpdateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      showToast(`Request marked as ${status.toUpperCase()}!`, 'success');
      fetchBookings();
    } catch (err) {
      showToast(err.message || 'Failed to update request status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase flex items-center gap-1"><FiCheckCircle /> ACCEPTED</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase flex items-center gap-1"><FiXCircle /> REJECTED</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase flex items-center gap-1"><FiCheckCircle /> COMPLETED</span>;
      case 'pending':
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase flex items-center gap-1"><FiClock /> PENDING APPROVAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tool Requests & Bookings</h2>
          <p className="text-xs text-slate-500 mt-1">Manage incoming requests from neighbors and track tools you've requested.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'incoming'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Incoming Requests
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sent Requests
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-bold">Loading tool requests...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            {activeTab === 'incoming' ? 'No incoming requests for your tools yet.' : 'You have not sent any tool borrowing requests yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const isOwner = activeTab === 'incoming';
            const otherParty = isOwner ? b.renter : b.owner;

            return (
              <div
                key={b._id}
                className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">{b.tool?.title || 'Tool'}</h4>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-primary text-sm" />
                      <span>
                        <strong>Rental Dates:</strong> {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiUser className="text-primary text-sm" />
                      <span>
                        <strong>{isOwner ? 'Requested By:' : 'Tool Owner:'}</strong> {otherParty?.name || 'Neighbor'}
                      </span>
                    </div>

                    {otherParty?.phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-emerald-500 text-sm" />
                        <span>
                          <strong>Contact Phone:</strong> {otherParty.phone}
                        </span>
                      </div>
                    )}

                    {otherParty?.location?.address && (
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-primary text-sm" />
                        <span>
                          <strong>Location:</strong> {otherParty.location.address}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold">
                      Total: ${b.totalPrice} ({b.paymentOption})
                    </span>
                  </div>
                </div>

                {/* Actions for Tool Owner on Incoming Requests */}
                {isOwner && (
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 justify-end">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'approved')}
                          disabled={updatingId === b._id}
                          className="px-5 py-2.5 rounded-xl font-extrabold text-white text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <FiCheckCircle /> Accept Request
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'rejected')}
                          disabled={updatingId === b._id}
                          className="px-5 py-2.5 rounded-xl font-extrabold text-white text-xs bg-rose-600 hover:bg-rose-700 shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <FiXCircle /> Reject Request
                        </button>
                      </>
                    )}

                    {b.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'completed')}
                        disabled={updatingId === b._id}
                        className="px-5 py-2.5 rounded-xl font-extrabold text-white text-xs bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <FiCheckCircle /> Mark Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
