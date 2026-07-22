const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetType: { type: String, enum: ['tool', 'helper'], required: true }
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, tool: 1, helper: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
