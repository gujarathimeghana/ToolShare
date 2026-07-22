const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Electrician, Plumber, Carpenter, etc.
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    offerPrice: { type: Number, required: true },
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'open'
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true }
    },
    urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' }
  },
  { timestamps: true }
);

helpRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
