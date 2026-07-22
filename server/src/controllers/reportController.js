const Report = require('../models/Report');
const { sendResponse } = require('../utils/response');

exports.createReport = async (req, res, next) => {
  try {
    const { reportedUserId, reportedToolId, reason, details } = req.body;

    if (!reason || !details) {
      return sendResponse(res, 400, false, 'Reason and details are required');
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId || null,
      reportedTool: reportedToolId || null,
      reason,
      details
    });

    return sendResponse(res, 201, true, 'Report submitted successfully for admin review', report);
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedTool', 'title')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Reports fetched', reports);
  } catch (error) {
    next(error);
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    return sendResponse(res, 200, true, 'Report status updated', report);
  } catch (error) {
    next(error);
  }
};
