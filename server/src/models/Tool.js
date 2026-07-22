const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String, required: true }],
    pricePerDay: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['available', 'borrowed', 'maintenance'], default: 'available' },
    condition: { type: String, enum: ['Like New', 'Excellent', 'Good', 'Fair'], default: 'Good' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      address: { type: String, required: true }
    },
    availabilityCalendar: [
      {
        startDate: { type: Date },
        endDate: { type: Date }
      }
    ],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    borrowCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

toolSchema.index({ location: '2dsphere' });
toolSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Tool', toolSchema);
