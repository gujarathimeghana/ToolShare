import React, { useState } from 'react';
import { FiStar, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const RATING_LABELS = {
  1: '1 Star — Very Poor 😞',
  2: '2 Stars — Poor 🙁',
  3: '3 Stars — Average 😐',
  4: '4 Stars — Good 😊',
  5: '5 Stars — Excellent 🤩'
};

const MAX_CHAR_LIMIT = 500;

const ReviewModal = ({ isOpen, onClose, booking, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useNotification();

  if (!isOpen || !booking) return null;

  const tool = booking.tool || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!rating || rating < 1 || rating > 5) {
      setErrorMsg('Please select a star rating between 1 and 5.');
      return;
    }

    if (!reviewText.trim()) {
      setErrorMsg('Please write a short review sharing your experience.');
      return;
    }

    if (reviewText.trim().length > MAX_CHAR_LIMIT) {
      setErrorMsg(`Review text cannot exceed ${MAX_CHAR_LIMIT} characters.`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        bookingId: booking._id,
        rating,
        comment: reviewText.trim()
      });

      showToast('Thank you! Your review has been submitted successfully.', 'success');
      if (onReviewSubmitted) {
        onReviewSubmitted(res.data?.data?.review || res.data);
      }
      onClose();
    } catch (err) {
      console.error('Submit review error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit review';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hoverRating || rating;
  const remainingChars = MAX_CHAR_LIMIT - reviewText.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
            Rate & Review Tool
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            How was your experience?
          </h3>
          <p className="text-xs text-slate-500">
            Share feedback about borrowing this tool to help your neighborhood community.
          </p>
        </div>

        {/* Tool Preview Badge */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <img
            src={tool.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200'}
            alt={tool.title || 'Tool'}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">
              {tool.title || 'Tool'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Borrowed from: <span className="font-bold text-slate-700 dark:text-slate-300">{booking.owner?.name || 'Neighbor'}</span>
            </p>
          </div>
        </div>

        {/* Validation Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <FiAlertCircle className="text-base shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Selector */}
          <div className="text-center space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Select Rating (1 to 5 Stars)
            </label>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <FiStar
                    className={`text-3xl sm:text-4xl transition-colors ${
                      star <= activeRating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 h-5">
              {RATING_LABELS[activeRating] || 'Click stars to select rating'}
            </div>
          </div>

          {/* Review Text Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Write your review <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[11px] font-bold ${remainingChars < 30 ? 'text-rose-500' : 'text-slate-400'}`}>
                {remainingChars} chars remaining
              </span>
            </div>

            <textarea
              rows="4"
              maxLength={MAX_CHAR_LIMIT}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe the condition of the tool, ease of pickup, and overall experience..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl font-extrabold text-white text-xs btn-gradient shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting Review...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
