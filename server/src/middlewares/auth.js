const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, token missing');
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return sendResponse(res, 401, false, 'User no longer exists');
    }
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Token verification failed');
  }
};

module.exports = { protect };
