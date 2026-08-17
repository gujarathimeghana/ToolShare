const Review = require('../models/Review');
const Tool = require('../models/Tool');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

// POST /api/reviews - Submit a new tool rating & review
exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment, reviewText } = req.body;
    const finalComment = (comment || reviewText || '').trim();
    const finalRating = Number(rating);

    // 1. Validate Input Payload
    if (!bookingId) {
      return sendResponse(res, 400, false, 'Borrowing transaction ID (bookingId) is required');
    }
    if (!finalRating || isNaN(finalRating) || finalRating < 1 || finalRating > 5) {
      return sendResponse(res, 400, false, 'Rating must be an integer between 1 and 5');
    }
    if (!finalComment) {
      return sendResponse(res, 400, false, 'Review text is required');
    }
    if (finalComment.length > 500) {
      return sendResponse(res, 400, false, 'Review text cannot exceed 500 characters');
    }

    // 2. Fetch Borrowing Transaction
    const booking = await Booking.findById(bookingId).populate('tool owner renter');
    if (!booking) {
      return sendResponse(res, 404, false, 'Borrowing transaction not found');
    }

    // 3. Security & Validation Checks
    const userId = req.user._id.toString();

    // Check borrower ownership of transaction
    if (booking.renter._id.toString() !== userId) {
      return sendResponse(res, 403, false, 'You can only review tools from your own borrowing transactions');
    }

    // Prevent reviewing own tool
    if (booking.owner._id.toString() === userId) {
      return sendResponse(res, 400, false, 'You cannot review a tool that belongs to yourself');
    }

    // Ensure transaction is completed/returned
    if (booking.status !== 'completed') {
      return sendResponse(res, 400, false, 'You can only review a tool after the borrowing transaction is marked as completed/returned');
    }

    // Check for duplicate review submission
    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) {
      return sendResponse(res, 400, false, 'You have already submitted a review for this borrowing transaction');
    }

    // 4. Create & Save Review
    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: booking.owner._id,
      tool: booking.tool._id,
      booking: booking._id,
      toolOwner: booking.owner._id,
      targetType: 'tool',
      rating: finalRating,
      comment: finalComment
    });

    // 5. Recalculate Tool Average Rating & Review Count
    const allToolReviews = await Review.find({ tool: booking.tool._id });
    const totalRatingSum = allToolReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRatingSum / allToolReviews.length).toFixed(1));

    await Tool.findByIdAndUpdate(booking.tool._id, {
      rating: avgRating,
      reviewCount: allToolReviews.length
    });

    const populatedReview = await Review.findById(review._id).populate('reviewer', 'name avatar');

    return sendResponse(res, 201, true, 'Review submitted successfully!', {
      review: populatedReview,
      updatedRating: avgRating,
      updatedReviewCount: allToolReviews.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(res, 400, false, 'You have already submitted a review for this borrowing transaction');
    }
    next(error);
  }
};

// GET /api/reviews - Get reviews by toolId or userId
exports.getReviews = async (req, res, next) => {
  try {
    const { toolId, userId, bookingId } = req.query;
    const filter = {};

    if (toolId) filter.tool = toolId;
    if (userId) filter.reviewee = userId;
    if (bookingId) filter.booking = bookingId;

    const reviews = await Review.find(filter)
      .populate('reviewer', 'name avatar')
      .populate('tool', 'title images')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Reviews fetched successfully', reviews);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/tool/:toolId - Get all reviews for a specific tool
exports.getToolReviews = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const reviews = await Review.find({ tool: toolId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Tool reviews fetched', reviews);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/tool/:toolId/summary - Get rating summary and distribution
exports.getToolReviewSummary = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const reviews = await Review.find({ tool: toolId });

    const totalReviews = reviews.length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let totalSum = 0;
    reviews.forEach(r => {
      totalSum += r.rating;
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    });

    const averageRating = totalReviews > 0 ? Number((totalSum / totalReviews).toFixed(1)) : 0;

    return sendResponse(res, 200, true, 'Review summary calculated', {
      averageRating,
      totalReviews,
      distribution
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/eligibility/:bookingId - Check review eligibility
exports.checkEligibility = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id.toString();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendResponse(res, 404, false, 'Borrowing transaction not found', { eligible: false });
    }

    if (booking.renter.toString() !== userId) {
      return sendResponse(res, 200, true, 'Ineligible: Not the borrower', { eligible: false, reason: 'Not borrower' });
    }

    if (booking.status !== 'completed') {
      return sendResponse(res, 200, true, 'Ineligible: Transaction not completed', { eligible: false, reason: 'Transaction pending/active' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return sendResponse(res, 200, true, 'Already reviewed', { eligible: false, reviewed: true, review: existingReview });
    }

    return sendResponse(res, 200, true, 'Eligible for review', { eligible: true });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/my-reviews - Get all reviews submitted by the logged-in user
exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('tool', 'title images')
      .populate('booking')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'My reviews fetched', reviews);
  } catch (error) {
    next(error);
  }
};
