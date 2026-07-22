const Favorite = require('../models/Favorite');
const { sendResponse } = require('../utils/response');

exports.toggleFavorite = async (req, res, next) => {
  try {
    const { toolId, helperId, targetType } = req.body;

    const filter = { user: req.user._id, targetType };
    if (targetType === 'tool') filter.tool = toolId;
    if (targetType === 'helper') filter.helper = helperId;

    const existing = await Favorite.findOne(filter);

    if (existing) {
      await existing.deleteOne();
      return sendResponse(res, 200, true, 'Removed from favorites', { isFavorite: false });
    } else {
      await Favorite.create({
        user: req.user._id,
        tool: toolId || null,
        helper: helperId || null,
        targetType
      });
      return sendResponse(res, 201, true, 'Added to favorites', { isFavorite: true });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({ path: 'tool', populate: { path: 'owner category' } })
      .populate('helper', 'name avatar rating helperSkills hourlyRate location')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'User favorites fetched', favorites);
  } catch (error) {
    next(error);
  }
};
