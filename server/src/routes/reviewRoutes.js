const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  getToolReviews,
  getToolReviewSummary,
  checkEligibility,
  getMyReviews
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

router.get('/', getReviews);
router.post('/', protect, createReview);

router.get('/tool/:toolId', getToolReviews);
router.get('/tool/:toolId/summary', getToolReviewSummary);
router.get('/eligibility/:bookingId', protect, checkEligibility);
router.get('/my-reviews', protect, getMyReviews);

module.exports = router;
