const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

exports.getOrCreateChat = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      return sendResponse(res, 400, false, 'Recipient ID is required');
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, recipientId] }
    }).populate('participants', 'name avatar isHelper phone location');

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, recipientId]
      });
      chat = await Chat.findById(chat._id).populate('participants', 'name avatar isHelper phone location');
    }

    return sendResponse(res, 200, true, 'Chat retrieved or created', chat);
  } catch (error) {
    next(error);
  }
};

exports.getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name avatar isHelper phone location rating')
      .sort({ updatedAt: -1 });

    return sendResponse(res, 200, true, 'User chats fetched', chats);
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { chat: req.params.chatId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    return sendResponse(res, 200, true, 'Messages fetched', messages);
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, recipientId, text, image, location } = req.body;

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      recipient: recipientId,
      text: text || '',
      image: image || '',
      location: location || null
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text || (image ? '📷 Image' : '📍 Location'),
      lastMessageSender: req.user._id,
      lastMessageTime: Date.now()
    });

    const populatedMsg = await Message.findById(message._id).populate('sender', 'name avatar');

    return sendResponse(res, 201, true, 'Message sent', populatedMsg);
  } catch (error) {
    next(error);
  }
};
