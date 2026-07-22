const Message = require('../models/Message');
const Chat = require('../models/Chat');

const initSocketIO = (io) => {
  const onlineUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log(`[Socket Connected]: ${socket.id}`);

    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('online_users_list', Array.from(onlineUsers.keys()));
    });

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    socket.on('typing', ({ chatId, userId, userName }) => {
      socket.to(chatId).emit('user_typing', { userId, userName });
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('user_stop_typing', { userId });
    });

    socket.on('send_message', async (data) => {
      try {
        const { chatId, senderId, recipientId, text, image, location } = data;

        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          recipient: recipientId,
          text: text || '',
          image: image || '',
          location: location || null
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: text || (image ? '📷 Image' : '📍 Location'),
          lastMessageSender: senderId,
          lastMessageTime: Date.now()
        });

        const populatedMsg = await Message.findById(message._id).populate('sender', 'name avatar');
        io.to(chatId).emit('new_message', populatedMsg);
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('online_users_list', Array.from(onlineUsers.keys()));
      console.log(`[Socket Disconnected]: ${socket.id}`);
    });
  });
};

module.exports = initSocketIO;
