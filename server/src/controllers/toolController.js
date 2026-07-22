const Tool = require('../models/Tool');
const Category = require('../models/Category');
const { sendResponse } = require('../utils/response');

exports.createTool = async (req, res, next) => {
  try {
    const { title, description, category, images, pricePerDay, securityDeposit, condition, location, tags } = req.body;

    if (!title || !description || !category || !pricePerDay) {
      return sendResponse(res, 400, false, 'Title, description, category, and pricePerDay are required');
    }

    const categoryObj = await Category.findById(category);
    if (!categoryObj) {
      return sendResponse(res, 400, false, 'Invalid category selected');
    }

    const toolImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'];

    const tool = await Tool.create({
      title,
      description,
      category,
      images: toolImages,
      pricePerDay,
      securityDeposit: securityDeposit || 0,
      condition: condition || 'Good',
      owner: req.user._id,
      location: location || req.user.location,
      tags: tags || []
    });

    categoryObj.itemCount += 1;
    await categoryObj.save();

    return sendResponse(res, 201, true, 'Tool listed successfully', tool);
  } catch (error) {
    next(error);
  }
};

exports.getTools = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, condition, lat, lng, radius, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (condition) {
      query.condition = condition;
    }

    if (lat && lng) {
      const maxDistanceInMeters = (Number(radius) || 25) * 1000;
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: maxDistanceInMeters
        }
      };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { pricePerDay: 1 };
    if (sort === 'price_desc') sortOptions = { pricePerDay: -1 };
    if (sort === 'popular') sortOptions = { borrowCount: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };

    const tools = await Tool.find(query)
      .populate('category', 'name slug icon')
      .populate('owner', 'name avatar rating location phone')
      .sort(sortOptions);

    return sendResponse(res, 200, true, 'Tools fetched successfully', tools);
  } catch (error) {
    next(error);
  }
};

exports.getToolById = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('category', 'name slug icon')
      .populate('owner', 'name avatar rating reviewCount location phone bio hourlyRate');

    if (!tool) {
      return sendResponse(res, 404, false, 'Tool not found');
    }

    return sendResponse(res, 200, true, 'Tool details fetched', tool);
  } catch (error) {
    next(error);
  }
};

exports.getUserListings = async (req, res, next) => {
  try {
    const tools = await Tool.find({ owner: req.user._id })
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'User listings fetched', tools);
  } catch (error) {
    next(error);
  }
};

exports.updateTool = async (req, res, next) => {
  try {
    let tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, false, 'Tool not found');
    }

    if (tool.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Unauthorized to edit this tool');
    }

    tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return sendResponse(res, 200, true, 'Tool updated successfully', tool);
  } catch (error) {
    next(error);
  }
};

exports.deleteTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return sendResponse(res, 404, false, 'Tool not found');
    }

    if (tool.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Unauthorized to delete this tool');
    }

    await tool.deleteOne();
    return sendResponse(res, 200, true, 'Tool deleted successfully');
  } catch (error) {
    next(error);
  }
};
