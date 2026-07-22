const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getUserBookings);

router.put('/:id/status', updateBookingStatus);

module.exports = router;
