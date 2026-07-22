const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { sendResponse } = require('../utils/response');
const { isValidEmail, isStrongPassword } = require('../utils/validators');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, location } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 400, false, 'Name, email, and password are required');
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!isValidEmail(cleanEmail)) {
      return sendResponse(res, 400, false, 'Invalid email format');
    }

    if (!isStrongPassword(password)) {
      return sendResponse(res, 400, false, 'Password must be at least 6 characters long');
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return sendResponse(res, 400, false, 'User already exists with this email');
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone || '',
      avatar: '',
      location: location || { type: 'Point', coordinates: [-73.935242, 40.73061], address: 'New York, NY' }
    });

    const token = generateToken(user._id, user.role);

    return sendResponse(res, 201, true, 'User registered successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isHelper: user.isHelper,
        location: user.location,
        rating: user.rating
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide email and password');
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid email or password credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid email or password credentials');
    }

    const token = generateToken(user._id, user.role);

    return sendResponse(res, 200, true, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isHelper: user.isHelper,
        location: user.location,
        rating: user.rating
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email) {
      return sendResponse(res, 400, false, 'Email is required for Google authentication');
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: cleanEmail,
        password: Math.random().toString(36).slice(-10) + 'A1!',
        avatar: avatar || '',
        isVerified: true
      });
    }

    const token = generateToken(user._id, user.role);

    return sendResponse(res, 200, true, 'Google authentication successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isHelper: user.isHelper,
        location: user.location
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

exports.sendPhoneOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return sendResponse(res, 400, false, 'Phone number is required');
    }
    const otp = '123456';
    return sendResponse(res, 200, true, 'OTP sent successfully (Demo OTP: 123456)', { otp });
  } catch (error) {
    next(error);
  }
};

exports.verifyPhoneOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (otp !== '123456') {
      return sendResponse(res, 400, false, 'Invalid OTP code');
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name: `User_${phone.slice(-4)}`,
        email: `${phone}@neighborly.app`,
        phone,
        password: Math.random().toString(36).slice(-10) + 'A1!',
        isVerified: true
      });
    }

    const token = generateToken(user._id, user.role);
    return sendResponse(res, 200, true, 'Phone verified successfully', { user, token });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendResponse(res, 200, true, 'User profile fetched', user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return sendResponse(res, 200, true, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    let avatarUrl = '';
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.avatarUrl) {
      avatarUrl = req.body.avatarUrl;
    } else {
      return sendResponse(res, 400, false, 'No file or image URL provided');
    }

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
    return sendResponse(res, 200, true, 'Avatar updated', { avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return sendResponse(res, 404, false, 'No account with that email address exists.');
    }
    return sendResponse(res, 200, true, 'Password reset instructions sent to email (Demo mode)');
  } catch (error) {
    next(error);
  }
};
