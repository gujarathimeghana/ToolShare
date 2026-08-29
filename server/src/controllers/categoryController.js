const Category = require('../models/Category');
const { sendResponse } = require('../utils/response');

const DEFAULT_CATEGORIES = [
  { name: 'Power Tools', slug: 'power-tools', icon: 'Zap', type: 'tool', description: 'Drills, saws, sanders, and power equipment' },
  { name: 'Hand Tools', slug: 'hand-tools', icon: 'Hammer', type: 'tool', description: 'Wrenches, hammers, screwdrivers, and pliers' },
  { name: 'Gardening', slug: 'gardening', icon: 'Sprout', type: 'tool', description: 'Lawn mowers, trimmers, shovels, and garden gear' },
  { name: 'Construction', slug: 'construction', icon: 'HardHat', type: 'tool', description: 'Ladders, cement mixers, scaffolding, and safety gear' },
  { name: 'Automotive', slug: 'automotive', icon: 'Car', type: 'tool', description: 'Jacks, OBD scanners, torque wrenches, and chargers' },
  { name: 'Electrical', slug: 'electrical', icon: 'Cpu', type: 'tool', description: 'Multimeters, wire strippers, voltage testers, and fish tape' },
  { name: 'Plumbing', slug: 'plumbing', icon: 'Wrench', type: 'tool', description: 'Pipe wrenches, snakes, crimpers, and plunger tools' },
  { name: 'Cleaning', slug: 'cleaning', icon: 'Sparkles', type: 'tool', description: 'Pressure washers, steam cleaners, and shop vacs' },
  { name: 'Kitchen', slug: 'kitchen', icon: 'Utensils', type: 'tool', description: 'Specialty food prep tools, mixers, and appliances' },
  { name: 'Home Improvement', slug: 'home-improvement', icon: 'Home', type: 'tool', description: 'Paint sprayers, wallpaper tools, and flooring gear' },
  { name: 'Outdoor', slug: 'outdoor', icon: 'Sun', type: 'tool', description: 'Camping equipment, drills, and outdoor gear' },
  { name: 'Other', slug: 'other', icon: 'Package', type: 'tool', description: 'Miscellaneous tools and equipment' }
];

exports.getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    let categories = await Category.find(filter).sort({ name: 1 });

    if (categories.length === 0 && (!type || type === 'tool')) {
      // Auto seed default categories in MongoDB Atlas if empty
      categories = await Category.insertMany(DEFAULT_CATEGORIES);
    }

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
