const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Tool = require('../models/Tool');
const Category = require('../models/Category');

async function testCategoryToolFlow() {
  await connectDB();
  console.log('\n====================================================');
  console.log('🧪 TESTING CATEGORY DROPDOWN & LIST TOOL FLOW');
  console.log('====================================================\n');

  try {
    const time = Date.now();

    // 1. Check or Seed Categories in MongoDB Atlas
    let categories = await Category.find({ type: 'tool' });
    console.log(`1. Fetching Categories from MongoDB Atlas (Count: ${categories.length})...`);
    if (categories.length === 0) {
      console.log('   Seeding standard categories...');
      categories = await Category.insertMany([
        { name: 'Power Tools', slug: 'power-tools', type: 'tool', icon: 'Zap' },
        { name: 'Hand Tools', slug: 'hand-tools', type: 'tool', icon: 'Hammer' },
        { name: 'Gardening', slug: 'gardening', type: 'tool', icon: 'Sprout' }
      ]);
    }
    console.log('   ✅ Categories available in MongoDB:');
    categories.forEach(c => console.log(`      - ${c.name} (ID: ${c._id})`));

    // 2. Find or Create Test Owner User
    let owner = await User.findOne();
    if (!owner) {
      owner = await User.create({
        name: `Test Owner ${time}`,
        email: `owner_${time}@example.com`,
        password: 'password123'
      });
    }

    // 3. Select Category "Power Tools"
    const powerToolsCat = categories.find(c => c.name === 'Power Tools') || categories[0];

    // 4. Create Tool with Category "Power Tools"
    console.log(`\n2. Creating Tool with Category "${powerToolsCat.name}"...`);
    const tool = await Tool.create({
      title: `Cordless Drill ${time}`,
      description: 'Cordless drill available for sharing.',
      category: powerToolsCat._id,
      pricePerDay: 15,
      securityDeposit: 50,
      condition: 'Good',
      owner: owner._id,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'],
      location: { type: 'Point', coordinates: [-73.935242, 40.73061], address: 'Manhattan, New York, NY' }
    });

    // 5. Retrieve Tool and Populate Category
    const fetchedTool = await Tool.findById(tool._id).populate('category');
    console.log('✅ Tool created & saved in MongoDBAtlas:');
    console.log('   - ID:', fetchedTool._id);
    console.log('   - Title:', fetchedTool.title);
    console.log('   - PricePerDay:', fetchedTool.pricePerDay);
    console.log('   - Category Name:', fetchedTool.category?.name);
    console.log('   - Category ID:', fetchedTool.category?._id.toString());

    if (fetchedTool.category?.name === 'Power Tools' || fetchedTool.category?._id.toString() === powerToolsCat._id.toString()) {
      console.log('\n====================================================');
      console.log('🎉 CATEGORY SELECTION & TOOL CREATION VERIFIED 100%');
      console.log('====================================================\n');
    } else {
      console.error('❌ Mismatch in saved category!');
    }
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    process.exit(0);
  }
}

testCategoryToolFlow();
