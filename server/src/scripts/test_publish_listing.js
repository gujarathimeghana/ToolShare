const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Tool = require('../models/Tool');
const Category = require('../models/Category');

async function testPublishListing() {
  await connectDB();
  console.log('\n====================================================');
  console.log('🧪 TESTING PUBLISH LISTING CONTROLLER & MODEL');
  console.log('====================================================\n');

  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Test Owner',
        email: `owner_${Date.now()}@example.com`,
        password: 'password123'
      });
    }

    console.log('User found:', user._id, user.name);

    let categoryObj = await Category.findOne({ name: 'Power Tools' });
    if (!categoryObj) {
      categoryObj = await Category.create({
        name: 'Power Tools',
        slug: 'power-tools',
        type: 'tool'
      });
    }

    console.log('Category found:', categoryObj._id, categoryObj.name);

    const payload = {
      title: 'Cordless Drill Kit',
      description: 'Cordless drill available for sharing.',
      category: categoryObj._id.toString(),
      pricePerDay: 15,
      securityDeposit: 50,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
    };

    const userLoc = user.location || {};
    const toolCity = userLoc.city || 'New York';
    const toolArea = userLoc.area || 'Manhattan';
    const toolState = userLoc.state || 'NY';
    const toolPincode = userLoc.pincode || '10001';
    const toolAddress = userLoc.address || 'Manhattan, New York, NY 10001';
    const coords = (userLoc.coordinates && userLoc.coordinates.length === 2)
      ? userLoc.coordinates
      : [-73.935242, 40.73061];

    const tool = await Tool.create({
      title: payload.title,
      description: payload.description,
      category: categoryObj._id,
      images: payload.images,
      pricePerDay: payload.pricePerDay,
      securityDeposit: payload.securityDeposit,
      condition: payload.condition,
      owner: user._id,
      location: {
        type: 'Point',
        coordinates: coords,
        city: toolCity,
        area: toolArea,
        state: toolState,
        pincode: toolPincode,
        address: toolAddress
      }
    });

    console.log('✅ Tool created successfully in MongoDB Atlas:');
    console.log('   - ID:', tool._id);
    console.log('   - Title:', tool.title);
    console.log('   - Category:', tool.category);

  } catch (err) {
    console.error('❌ Mongoose / Controller Error:', err);
  } finally {
    process.exit(0);
  }
}

testPublishListing();
