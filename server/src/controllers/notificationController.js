const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/response');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Notifications fetched', notifications);
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    return sendResponse(res, 200, true, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
