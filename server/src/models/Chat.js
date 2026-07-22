const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String, default: '' },
    lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastMessageTime: { type: Date, default: Date.now },
    unreadCount: { type: Map, of: Number, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
