const Booking = require('../models/Booking');
const Tool = require('../models/Tool');
const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/response');

exports.createBooking = async (req, res, next) => {
  try {
    const { toolId, startDate, endDate, paymentOption, notes } = req.body;

    if (!toolId || !startDate || !endDate) {
      return sendResponse(res, 400, false, 'Tool ID, start date, and end date are required');
    }

    const tool = await Tool.findById(toolId).populate('owner');
    if (!tool) {
      return sendResponse(res, 404, false, 'Tool not found');
    }

    if (tool.owner._id.toString() === req.user._id.toString()) {
      return sendResponse(res, 400, false, 'You cannot send a request for your own tool');
    }

    // Check for existing pending or active booking by same renter for same tool
    const existingBooking = await Booking.findOne({
      tool: toolId,
      renter: req.user._id,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    if (existingBooking) {
      return sendResponse(res, 400, false, 'You already have an active or pending request for this tool');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalPrice = (tool.pricePerDay * diffDays) + (tool.securityDeposit || 0);

    const booking = await Booking.create({
      tool: tool._id,
      renter: req.user._id,
      owner: tool.owner._id,
      startDate: start,
      endDate: end,
      totalPrice,
      paymentOption: paymentOption || 'cash_on_pickup',
      notes: notes || ''
    });

    // Send notification to tool owner
    await Notification.create({
      user: tool.owner._id,
      title: 'New Tool Request',
      message: `${req.user.name} requested to borrow your ${tool.title}`,
      type: 'booking',
      data: { bookingId: booking._id }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('tool')
      .populate('renter', 'name email avatar phone rating location')
      .populate('owner', 'name email avatar phone rating location');

    // Socket.IO real-time notification
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('new_request', populatedBooking);
        io.emit(`user_${tool.owner._id}_request`, populatedBooking);
      }
    } catch (err) {
      console.log('Socket emit notification error:', err);
    }

    return sendResponse(res, 201, true, 'Request sent successfully to owner!', populatedBooking);
  } catch (error) {
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const { role } = req.query; // 'renter', 'owner', or undefined/'all'

    let filter = {};
    if (role === 'owner') {
      filter = { owner: req.user._id };
    } else if (role === 'renter') {
      filter = { renter: req.user._id };
    } else {
      filter = { $or: [{ owner: req.user._id }, { renter: req.user._id }] };
    }

    const bookings = await Booking.find(filter)
      .populate('tool')
      .populate('renter', 'name email avatar phone rating location')
      .populate('owner', 'name email avatar phone rating location')
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
      return sendResponse(res, 404, false, 'Booking request not found');
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (returnConfirmed !== undefined) booking.returnConfirmed = returnConfirmed;

    if (status === 'approved' || status === 'active') {
      await Tool.findByIdAndUpdate(booking.tool._id, { status: 'borrowed', $inc: { borrowCount: 1 } });
    } else if (status === 'completed' || status === 'cancelled' || status === 'rejected') {
      await Tool.findByIdAndUpdate(booking.tool._id, { status: 'available' });
    }

    await booking.save();

    // Send status update notification to renter
    await Notification.create({
      user: booking.renter,
      title: 'Booking Status Updated',
      message: `Your request for ${booking.tool.title} was updated to ${booking.status}`,
      type: 'approval',
      data: { bookingId: booking._id }
    });

    const updatedBooking = await Booking.findById(booking._id)
      .populate('tool')
      .populate('renter', 'name email avatar phone rating location')
      .populate('owner', 'name email avatar phone rating location');

    // Socket.IO real-time notification
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('request_updated', updatedBooking);
        io.emit(`user_${booking.renter}_request_updated`, updatedBooking);
        io.emit(`user_${booking.owner}_request_updated`, updatedBooking);
      }
    } catch (err) {
      console.log('Socket emit notification error:', err);
    }

    return sendResponse(res, 200, true, `Request updated to ${booking.status}`, updatedBooking);
  } catch (error) {
    next(error);
  }
};
