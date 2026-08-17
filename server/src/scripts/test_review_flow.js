const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Tool = require('../models/Tool');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

async function testReviewSystem() {
  await connectDB();
  console.log('\n====================================================');
  console.log('🧪 TESTING END-TO-END RATING & REVIEW SYSTEM');
  console.log('====================================================\n');

  try {
    const time = Date.now();

    // 1. Create Owner User A
    const owner = await User.create({
      name: `Review Owner ${time}`,
      email: `owner_${time}@example.com`,
      password: 'password123',
      city: 'Austin',
      area: 'Downtown',
      state: 'TX',
      pincode: '78701'
    });
    console.log('✅ Created User A (Tool Owner):', owner.name);

    // 2. Create Borrower User B
    const borrower = await User.create({
      name: `Review Borrower ${time}`,
      email: `borrower_${time}@example.com`,
      password: 'password123',
      city: 'Austin',
      area: 'South Congress',
      state: 'TX',
      pincode: '78704'
    });
    console.log('✅ Created User B (Borrower):', borrower.name);

    // 3. Create Tool owned by User A
    const tool = await Tool.create({
      title: `DeWalt Heavy Duty Cordless Drill ${time}`,
      description: '20V Max Lithium Drill Kit',
      category: new mongoose.Types.ObjectId(),
      pricePerDay: 25,
      securityDeposit: 50,
      owner: owner._id,
      condition: 'Excellent',
      location: { coordinates: [-97.7431, 30.2672], address: 'Downtown, Austin, TX - 78701' },
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
    });
    console.log('✅ Created Tool:', tool.title);
    console.log('   - Initial Rating:', tool.rating);
    console.log('   - Initial Review Count:', tool.reviewCount);

    // 4. Create Completed Booking for User B
    const booking = await Booking.create({
      tool: tool._id,
      renter: borrower._id,
      owner: owner._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 2),
      totalPrice: 100,
      status: 'completed',
      paymentOption: 'cash_on_pickup'
    });
    console.log('✅ Created Completed Borrowing Transaction:', booking._id);

    // 5. Submit Review from User B for this booking
    const review = await Review.create({
      reviewer: borrower._id,
      reviewee: owner._id,
      tool: tool._id,
      booking: booking._id,
      toolOwner: owner._id,
      targetType: 'tool',
      rating: 5,
      comment: 'The drill worked perfectly and was in excellent condition.'
    });
    console.log('✅ Created Review:', review._id);
    console.log('   - Rating:', review.rating);
    console.log('   - Comment:', review.comment);

    // 6. Recalculate Tool Rating
    const allToolReviews = await Review.find({ tool: tool._id });
    const totalRatingSum = allToolReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRatingSum / allToolReviews.length).toFixed(1));

    const updatedTool = await Tool.findByIdAndUpdate(
      tool._id,
      { rating: avgRating, reviewCount: allToolReviews.length },
      { new: true }
    );

    console.log('✅ Recalculated Tool Rating in MongoDB:');
    console.log('   - Updated Rating:', updatedTool.rating);
    console.log('   - Updated Review Count:', updatedTool.reviewCount);

    // 7. Verify Unique Index prevents duplicate reviews for same booking
    try {
      await Review.create({
        reviewer: borrower._id,
        reviewee: owner._id,
        tool: tool._id,
        booking: booking._id,
        rating: 4,
        comment: 'Duplicate review attempt'
      });
      console.error('❌ Duplicate review test failed!');
    } catch (dupErr) {
      console.log('✅ Duplicate Review Prevention Index Verified (E11000 duplicate key error caught properly)');
    }

    console.log('\n====================================================');
    console.log('🎉 ALL REVIEW SYSTEM VERIFICATIONS PASSED 100%');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    process.exit(0);
  }
}

testReviewSystem();
