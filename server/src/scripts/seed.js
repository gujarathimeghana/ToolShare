const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
dotenv.config();

// Force DNS to use Google / Cloudflare public DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const User = require('../models/User');
const Category = require('../models/Category');
const Tool = require('../models/Tool');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://meghaveni236_db_user:123user123@cluster0.zraxqfo.mongodb.net/neighborly?retryWrites=true&w=majority', {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('[MongoDB Atlas Connected for Seeding]');
  } catch (err) {
    console.error('DB Connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    await Category.deleteMany();
    await User.deleteMany();
    await Tool.deleteMany();

    console.log('Cleared existing data.');

    // Seed Categories
    const categoriesData = [
      { name: 'Power Tools', slug: 'power-tools', type: 'tool', icon: 'Zap', description: 'Drills, saws, sanders, and heavy duty electric tools' },
      { name: 'Hand Tools', slug: 'hand-tools', type: 'tool', icon: 'Wrench', description: 'Hammers, screwdrivers, wrenches, and pliers' },
      { name: 'Gardening', slug: 'gardening', type: 'tool', icon: 'Flower', description: 'Lawnmowers, trimmers, shovels, and hoses' },
      { name: 'Cleaning', slug: 'cleaning', type: 'tool', icon: 'Sparkles', description: 'Pressure washers, steam cleaners, and vacuums' },
      { name: 'Painting', slug: 'painting', type: 'tool', icon: 'Paintbrush', description: 'Ladders, paint sprayers, rollers, and drop cloths' },
      { name: 'Construction', slug: 'construction', type: 'tool', icon: 'Hammer', description: 'Cement mixers, scaffolding, and safety gear' },
      { name: 'Automotive', slug: 'automotive', type: 'tool', icon: 'Car', description: 'Car jacks, OBD2 scanners, and socket sets' },
      { name: 'Kitchen', slug: 'kitchen', type: 'tool', icon: 'Utensils', description: 'Stand mixers, pressure cookers, and party equipment' },
      { name: 'Electronics', slug: 'electronics', type: 'tool', icon: 'Cpu', description: 'Soldering irons, multimeters, and wire strippers' },
      { name: 'Sports & Outdoors', slug: 'sports', type: 'tool', icon: 'Activity', description: 'Tents, kayaks, camping stoves, and bikes' },
      { name: 'DIY & Crafts', slug: 'diy', type: 'tool', icon: 'Scissors', description: 'Sewing machines, glue guns, and vinyl cutters' }
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${insertedCategories.length} categories.`);

    // Seed Admin & Users
    const admin = await User.create({
      name: 'Neighborly Admin',
      email: 'admin@neighborly.com',
      password: 'adminpassword123',
      role: 'admin',
      isVerified: true,
      phone: '+1234567890'
    });

    const user1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      phone: '+15550192834',
      isVerified: true,
      isHelper: true,
      helperSkills: ['Plumber', 'Electrician'],
      hourlyRate: 35,
      location: { type: 'Point', coordinates: [-73.935242, 40.73061], address: 'Brooklyn, NY' }
    });

    const user2 = await User.create({
      name: 'Sarah Miller',
      email: 'sarah@example.com',
      password: 'password123',
      phone: '+15550192835',
      isVerified: true,
      isHelper: true,
      helperSkills: ['Gardener', 'Painter'],
      hourlyRate: 25,
      location: { type: 'Point', coordinates: [-73.98513, 40.758896], address: 'Manhattan, NY' }
    });

    console.log('Seeded sample users.');

    // Seed Tools
    const powerToolCat = insertedCategories.find(c => c.slug === 'power-tools');
    const gardenCat = insertedCategories.find(c => c.slug === 'gardening');

    await Tool.create([
      {
        title: 'DeWalt 20V Max Cordless Drill Kit',
        description: 'High performance brushless motor drill with two 20V lithium batteries and fast charger.',
        category: powerToolCat._id,
        images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600'],
        pricePerDay: 15,
        securityDeposit: 50,
        condition: 'Like New',
        owner: user1._id,
        location: user1.location,
        rating: 4.9,
        reviewCount: 12
      },
      {
        title: 'Husqvarna Gas Powered Lawn Mower',
        description: '21-inch self-propelled lawn mower ideal for medium to large residential yards.',
        category: gardenCat._id,
        images: ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=600'],
        pricePerDay: 25,
        securityDeposit: 80,
        condition: 'Excellent',
        owner: user2._id,
        location: user2.location,
        rating: 4.8,
        reviewCount: 8
      }
    ]);

    console.log('Seeded sample tools.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
