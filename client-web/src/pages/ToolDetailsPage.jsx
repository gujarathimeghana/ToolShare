import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import UserAvatar from '../components/UserAvatar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FiMapPin, FiCalendar, FiShield, FiUser, FiMessageSquare, FiStar, FiThumbsUp, FiCheckCircle } from 'react-icons/fi';

const ToolDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentOption, setPaymentOption] = useState('cash_on_pickup');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchToolDetails = async () => {
    try {
      const [toolRes, reviewRes, summaryRes] = await Promise.all([
        api.get(`/tools/${id}`),
        api.get(`/reviews?toolId=${id}`),
        api.get(`/reviews/tool/${id}/summary`).catch(() => null)
      ]);

      setTool(toolRes.data);
      setReviews(reviewRes.data || []);
      if (summaryRes?.data?.data) {
        setSummary(summaryRes.data.data);
      } else if (reviewRes.data) {
        const revs = reviewRes.data;
        const total = revs.length;
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;
        revs.forEach(r => {
          sum += r.rating;
          if (dist[r.rating] !== undefined) dist[r.rating] += 1;
        });
        const avg = total > 0 ? Number((sum / total).toFixed(1)) : 0;
        setSummary({ averageRating: avg, totalReviews: total, distribution: dist });
      }
    } catch (err) {
      console.error('Tool details fetch error:', err);
      showToast('Failed to load tool details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-bold">Tool listing not found.</div>;
  }

  const loc = tool.location || {};
  const formattedAddress = loc.address || [loc.area, loc.city, loc.state].filter(Boolean).join(', ') + (loc.pincode ? ` - ${loc.pincode}` : '');
  const totalReviewCount = summary.totalReviews || tool.reviewCount || reviews.length;
  const avgScore = summary.averageRating || tool.rating || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
            <img
              src={tool.images?.[activeImage] || tool.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'}
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

            {/* Prominent Header Rating */}
            <div className="flex items-center gap-2">
              <RatingStars rating={avgScore} count={totalReviewCount} size="text-lg" />
            </div>

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
              <UserAvatar name={tool.owner?.name || 'Neighbor'} avatarUrl={tool.owner?.avatar} size="md" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{tool.owner?.name || 'Tool Owner'}</h4>
                <p className="text-xs text-slate-500">Tool Owner • Verified Neighbor</p>
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

      {/* ================= RATINGS & REVIEWS SECTION ================= */}
      <section className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FiStar className="text-amber-400 fill-amber-400" /> Ratings & Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verified feedback from neighbors who have borrowed this tool.
            </p>
          </div>

          {totalReviewCount > 0 && (
            <span className="px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm self-start sm:self-auto">
              ⭐ {avgScore.toFixed(1)} / 5.0 Rating Score
            </span>
          )}
        </div>

        {/* Rating Summary & Visual Distribution Bar Chart */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80">
          {/* Left Column: Overall Rating Big Card */}
          <div className="md:col-span-4 text-center md:border-r border-slate-200 dark:border-slate-800 pr-0 md:pr-6 space-y-2">
            {totalReviewCount > 0 ? (
              <>
                <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {avgScore.toFixed(1)}
                </div>
                <div className="flex justify-center text-amber-400 gap-1 text-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={star <= Math.round(avgScore) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-bold">
                  Based on {totalReviewCount} verified {totalReviewCount === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : (
              <div className="py-4 space-y-2">
                <FiStar className="text-4xl text-slate-300 dark:text-slate-700 mx-auto" />
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">No reviews yet</div>
                <p className="text-xs text-slate-500">Be the first neighbor to borrow and rate this tool!</p>
              </div>
            )}
          </div>

          {/* Right Column: Visual Rating Bars (5★ to 1★) */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution?.[star] || 0;
              const percent = totalReviewCount > 0 ? Math.round((count / totalReviewCount) * 100) : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-10 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {star} <FiStar className="text-amber-400 fill-amber-400 text-xs" />
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-bold text-slate-500 dark:text-slate-400">
                    {count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Reviews List */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Community Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-sm">
              No reviews submitted yet for this tool listing.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const reviewerName = rev.reviewer?.name || 'Verified Borrower';
                const dateStr = new Date(rev.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={reviewerName} avatarUrl={rev.reviewer?.avatar} size="sm" />
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {reviewerName}
                          </h5>
                          <span className="text-[11px] text-slate-400 font-semibold">{dateStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl text-amber-500 text-xs font-black">
                        <span>{rev.rating}.0</span>
                        <FiStar className="fill-amber-400" />
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium pl-1">
                      "{rev.comment}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
