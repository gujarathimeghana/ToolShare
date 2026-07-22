const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  sendPhoneOtp,
  verifyPhoneOtp,
  getProfile,
  updateProfile,
  uploadAvatar,
  forgotPassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', googleLogin);
router.post('/otp/send', sendPhoneOtp);
router.post('/otp/verify', verifyPhoneOtp);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
