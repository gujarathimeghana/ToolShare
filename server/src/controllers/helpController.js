const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

exports.createHelpRequest = async (req, res, next) => {
  try {
    const { title, description, category, offerPrice, scheduledDate, location, urgency } = req.body;

    if (!title || !description || !category || !offerPrice || !scheduledDate) {
      return sendResponse(res, 400, false, 'Title, description, category, offerPrice, and scheduledDate are required');
    }

    const helpRequest = await HelpRequest.create({
      title,
      description,
      category,
      offerPrice,
      scheduledDate,
      urgency: urgency || 'Medium',
      requester: req.user._id,
      location: location || req.user.location
    });

    return sendResponse(res, 201, true, 'Help request posted successfully', helpRequest);
  } catch (error) {
    next(error);
  }
};

exports.getHelpRequests = async (req, res, next) => {
  try {
    const { category, urgency, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;

    const helpRequests = await HelpRequest.find(filter)
      .populate('requester', 'name avatar rating location phone')
      .populate('helper', 'name avatar rating phone')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Help requests fetched', helpRequests);
  } catch (error) {
    next(error);
  }
};

exports.getHelpersList = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isHelper: true };

    if (category) {
      filter.helperSkills = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const helpers = await User.find(filter).select('-password');
    return sendResponse(res, 200, true, 'Helpers list fetched', helpers);
  } catch (error) {
    next(error);
  }
};

exports.acceptHelpJob = async (req, res, next) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) {
      return sendResponse(res, 404, false, 'Help request not found');
    }

    if (helpRequest.status !== 'open') {
      return sendResponse(res, 400, false, 'Job is no longer open');
    }

    helpRequest.helper = req.user._id;
    helpRequest.status = 'assigned';
    await helpRequest.save();

    return sendResponse(res, 200, true, 'Job accepted successfully', helpRequest);
  } catch (error) {
    next(error);
  }
};

exports.updateHelpStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) {
      return sendResponse(res, 404, false, 'Help request not found');
    }

    helpRequest.status = status;
    await helpRequest.save();

    return sendResponse(res, 200, true, `Status updated to ${status}`, helpRequest);
  } catch (error) {
    next(error);
  }
};
