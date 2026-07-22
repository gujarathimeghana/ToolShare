const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedTool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
    reason: {
      type: String,
      enum: ['Fake User', 'Spam', 'Damaged Tool', 'Late Return', 'Fraud', 'Other'],
      required: true
    },
    details: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
