const User = require('../models/User');
const Tool = require('../models/Tool');
const Booking = require('../models/Booking');
const Report = require('../models/Report');
const Category = require('../models/Category');
const { sendResponse } = require('../utils/response');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });
    const toolsListed = await Tool.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const recentBookings = await Booking.find()
      .populate('tool', 'title')
      .populate('renter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const popularCategories = await Category.find().sort({ itemCount: -1 }).limit(5);

    return sendResponse(res, 200, true, 'Admin stats fetched', {
      totalUsers,
      activeUsers,
      toolsListed,
      totalBookings,
      pendingReports,
      revenuePlaceholder: '$12,450.00',
      recentBookings,
      popularCategories
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'All users fetched', users);
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }
    user.isVerified = !user.isVerified;
    await user.save();
    return sendResponse(res, 200, true, `User verification status updated to ${user.isVerified}`, user);
  } catch (error) {
    next(error);
  }
};
