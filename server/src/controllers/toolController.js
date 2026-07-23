const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const Category = require('../models/Category');
const { sendResponse } = require('../utils/response');

exports.createTool = async (req, res, next) => {
  try {
    const { title, description, category, categoryName, images, pricePerDay, securityDeposit, condition, location, city, area, state, pincode, tags } = req.body;

    if (!title || !description || !pricePerDay) {
      return sendResponse(res, 400, false, 'Title, description, and pricePerDay are required');
    }

    const catQuery = categoryName || category || 'Power Tools';
    let categoryObj = null;

    const isStrictObjectId = typeof catQuery === 'string' && /^[0-9a-fA-F]{24}$/.test(catQuery);

    if (isStrictObjectId) {
      try {
        categoryObj = await Category.findById(catQuery);
      } catch (e) {
        categoryObj = null;
      }
    }

    if (!categoryObj && typeof catQuery === 'string') {
      try {
        const safeCat = catQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        categoryObj = await Category.findOne({
          $or: [
            { name: new RegExp('^' + safeCat + '$', 'i') },
            { slug: catQuery.toLowerCase() }
          ]
        });
      } catch (e) {
        categoryObj = null;
      }
    }

    if (!categoryObj) {
      categoryObj = await Category.findOne();
    }

    if (!categoryObj) {
      categoryObj = await Category.create({
        name: 'General Tools',
        slug: 'general-tools',
        type: 'tool'
      });
    }

    const toolImages = images && Array.isArray(images) && images.length > 0 && images[0].trim() !== ''
      ? images
      : ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600'];

    const userLoc = req.user.location || {};
    const toolCity = city || location?.city || userLoc.city || 'New York';
    const toolArea = area || location?.area || userLoc.area || 'Manhattan';
    const toolState = state || location?.state || userLoc.state || 'NY';
    const toolPincode = pincode || location?.pincode || userLoc.pincode || '';
    const toolAddress = location?.address || [toolArea, toolCity, toolState].filter(Boolean).join(', ') + (toolPincode ? ` - ${toolPincode}` : '');

    const tool = await Tool.create({
      title,
      description,
      category: categoryObj._id,
      images: toolImages,
      pricePerDay: Number(pricePerDay),
      securityDeposit: Number(securityDeposit) || 0,
      condition: condition || 'Good',
      owner: req.user._id,
      location: {
        type: 'Point',
        coordinates: location?.coordinates || userLoc.coordinates || [-73.935242, 40.73061],
        city: toolCity,
        area: toolArea,
        state: toolState,
        pincode: toolPincode,
        address: toolAddress
      },
      tags: tags || []
    });

    categoryObj.itemCount += 1;
    await categoryObj.save();

    const populatedTool = await Tool.findById(tool._id)
      .populate('category', 'name slug icon')
      .populate('owner', 'name avatar rating location phone');

    return sendResponse(res, 201, true, 'Tool listed successfully', populatedTool);
  } catch (error) {
    next(error);
  }
};

exports.getTools = async (req, res, next) => {
  try {
    const { search, category, city, area, state, minPrice, maxPrice, condition, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } }
      ];
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    if (area) {
      query['location.area'] = { $regex: area, $options: 'i' };
    }
    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }

    if (category) {
      const isStrictObjectId = typeof category === 'string' && /^[0-9a-fA-F]{24}$/.test(category);
      if (isStrictObjectId) {
        query.category = category;
      } else {
        const safeCat = String(category).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const catObj = await Category.findOne({ name: new RegExp('^' + safeCat + '$', 'i') });
        if (catObj) query.category = catObj._id;
      }
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (condition) {
      query.condition = condition;
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
