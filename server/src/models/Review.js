const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    toolOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetType: { type: String, enum: ['tool', 'owner', 'helper'], default: 'tool' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
    images: [{ type: String }]
  },
  { timestamps: true }
);

reviewSchema.index({ tool: 1 });

module.exports = mongoose.model('Review', reviewSchema);
