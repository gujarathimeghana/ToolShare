const Review = require('../models/Review');
const Tool = require('../models/Tool');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

exports.createReview = async (req, res, next) => {
  try {
    const { revieweeId, toolId, targetType, rating, comment, images } = req.body;

    if (!rating || !comment || !targetType) {
      return sendResponse(res, 400, false, 'Rating, comment, and targetType are required');
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId || null,
      tool: toolId || null,
      targetType,
      rating,
      comment,
      images: images || []
    });

    // Update target rating
    if (targetType === 'tool' && toolId) {
      const toolReviews = await Review.find({ tool: toolId });
      const avg = toolReviews.reduce((sum, r) => sum + r.rating, 0) / toolReviews.length;
      await Tool.findByIdAndUpdate(toolId, { rating: avg.toFixed(1), reviewCount: toolReviews.length });
    } else if ((targetType === 'owner' || targetType === 'helper') && revieweeId) {
      const userReviews = await Review.find({ reviewee: revieweeId });
      const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      await User.findByIdAndUpdate(revieweeId, { rating: avg.toFixed(1), reviewCount: userReviews.length });
    }

    return sendResponse(res, 201, true, 'Review submitted successfully', review);
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { toolId, userId } = req.query;
    const filter = {};
    if (toolId) filter.tool = toolId;
    if (userId) filter.reviewee = userId;

    const reviews = await Review.find(filter)
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Reviews fetched', reviews);
  } catch (error) {
    next(error);
  }
};
