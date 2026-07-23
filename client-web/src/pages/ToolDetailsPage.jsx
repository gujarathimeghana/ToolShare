import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiMapPin, FiCalendar, FiShield, FiUser, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';

const ToolDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentOption, setPaymentOption] = useState('cash_on_pickup');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchToolDetails = async () => {
      try {
        const [toolRes, reviewRes] = await Promise.all([
          api.get(`/tools/${id}`),
          api.get(`/reviews?toolId=${id}`)
        ]);
        setTool(toolRes.data);
        setReviews(reviewRes.data);
      } catch (err) {
        showToast('Failed to load tool details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchToolDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      showToast('Please select rental start and end dates', 'error');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        toolId: tool._id,
        startDate,
        endDate,
        paymentOption
      });
      showToast('Booking request sent successfully to the owner!', 'success');
      setIsBookingOpen(false);
    } catch (err) {
      showToast(err.message || 'Booking request failed', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-bold">Loading tool details...</div>;
  }

  if (!tool) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-bold">Tool not found.</div>;
  }

  const loc = tool.location || {};
  const formattedAddress = loc.address || [loc.area, loc.city, loc.state].filter(Boolean).join(', ') + (loc.pincode ? ` - ${loc.pincode}` : '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
            <img
              src={tool.images?.[activeImage] || tool.images?.[0]}
              alt={tool.title}
              className="w-full h-full object-cover"
            />
          </div>
          {tool.images?.length > 1 && (
            <div className="flex items-center gap-3">
              {tool.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Booking Box */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {tool.category?.name || 'Tool'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                {tool.condition}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{tool.title}</h1>

            <RatingStars rating={tool.rating} count={tool.reviewCount} size="text-base" />

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">${tool.pricePerDay}</span>
              <span className="text-sm text-slate-500 font-semibold">/ day</span>
              {tool.securityDeposit > 0 && (
                <span className="ml-4 text-xs font-semibold text-slate-400">
                  (${tool.securityDeposit} refundable deposit)
                </span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">{tool.description}</p>

            <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 font-semibold">
              <FiMapPin className="text-primary text-lg shrink-0" />
              <span>Location: {formattedAddress || 'New York, NY'}</span>
            </div>
          </div>

          {/* Owner Box */}
          <div className="p-6 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={tool.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={tool.owner?.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{tool.owner?.name}</h4>
                <p className="text-xs text-slate-500">Tool Owner • Verified Neighbor</p>
                <RatingStars rating={tool.owner?.rating} size="text-xs" />
              </div>
            </div>

            {isAuthenticated && user?._id !== tool.owner?._id && (
              <Link
                to={`/dashboard/chat?recipient=${tool.owner?._id}`}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                title="Chat with Owner"
              >
                <FiMessageSquare className="text-xl" />
              </Link>
            )}
          </div>

          {/* Action Button */}
          {user?._id === tool.owner?._id ? (
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-600 text-center font-bold text-sm">
              You own this listing
            </div>
          ) : (
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg btn-gradient shadow-xl"
            >
              Request to Borrow Tool
            </button>
          )}
        </div>
      </div>

      {/* Pickup Location Details */}
      <section className="p-6 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FiMapPin className="text-primary" /> Pickup Location Details
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This tool is available for pickup in <strong>{formattedAddress || 'New York, NY'}</strong>. Contact owner upon request approval.
        </p>
      </section>

      {/* Booking Modal */}
      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={`Borrow ${tool.title}`}>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Payment Method</label>
            <select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            >
              <option value="cash_on_pickup">Cash on Pickup (Recommended)</option>
              <option value="pay_later">Pay Later (Arranged with Owner)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full py-3 rounded-xl font-bold text-white btn-gradient"
            >
              {bookingLoading ? 'Sending Request...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ToolDetailsPage;
