const Booking = require('../models/Booking');
const Tool = require('../models/Tool');
const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/response');

exports.createBooking = async (req, res, next) => {
  try {
    const { toolId, startDate, endDate, paymentOption, notes } = req.body;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return sendResponse(res, 404, false, 'Tool not found');
    }

    if (tool.owner.toString() === req.user._id.toString()) {
      return sendResponse(res, 400, false, 'You cannot borrow your own tool');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = (tool.pricePerDay * diffDays) + (tool.securityDeposit || 0);

    const booking = await Booking.create({
      tool: tool._id,
      renter: req.user._id,
      owner: tool.owner,
      startDate: start,
      endDate: end,
      totalPrice,
      paymentOption: paymentOption || 'cash_on_pickup',
      notes: notes || ''
    });

    // Send notification to tool owner
    await Notification.create({
      user: tool.owner,
      title: 'New Booking Request',
      message: `${req.user.name} requested to borrow your ${tool.title}`,
      type: 'booking',
      data: { bookingId: booking._id }
    });

    return sendResponse(res, 201, true, 'Booking request sent successfully', booking);
  } catch (error) {
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const { role } = req.query; // 'renter' or 'owner'
    const filter = role === 'owner' ? { owner: req.user._id } : { renter: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('tool')
      .populate('renter', 'name avatar phone rating')
      .populate('owner', 'name avatar phone rating')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Bookings fetched', bookings);
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, returnConfirmed } = req.body;
    const booking = await Booking.findById(req.params.id).populate('tool');

    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (returnConfirmed !== undefined) booking.returnConfirmed = returnConfirmed;

    if (status === 'active') {
      await Tool.findByIdAndUpdate(booking.tool._id, { status: 'borrowed', $inc: { borrowCount: 1 } });
    } else if (status === 'completed' || status === 'cancelled' || status === 'rejected') {
      await Tool.findByIdAndUpdate(booking.tool._id, { status: 'available' });
    }

    await booking.save();

    // Send status update notification to renter
    await Notification.create({
      user: booking.renter,
      title: 'Booking Status Updated',
      message: `Your booking for ${booking.tool.title} is now ${booking.status}`,
      type: 'approval',
      data: { bookingId: booking._id }
    });

    return sendResponse(res, 200, true, `Booking updated to ${booking.status}`, booking);
  } catch (error) {
    next(error);
  }
};
