const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    helpRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest' },
    targetType: { type: String, enum: ['tool', 'owner', 'helper'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
