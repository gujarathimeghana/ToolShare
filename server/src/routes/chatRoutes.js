const express = require('express');
const router = express.Router();
const { getOrCreateChat, getUserChats, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/init', getOrCreateChat);
router.get('/', getUserChats);
router.get('/:chatId/messages', getMessages);
router.post('/message', sendMessage);

module.exports = router;
