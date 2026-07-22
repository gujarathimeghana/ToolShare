const Category = require('../models/Category');
const { sendResponse } = require('../utils/response');

exports.getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const categories = await Category.find(filter).sort({ name: 1 });
    return sendResponse(res, 200, true, 'Categories fetched', categories);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon, type, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return sendResponse(res, 400, false, 'Category already exists');
    }

    const category = await Category.create({ name, slug, icon, type, description });
    return sendResponse(res, 201, true, 'Category created', category);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendResponse(res, 200, true, 'Category updated', category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, true, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
