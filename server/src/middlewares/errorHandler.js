const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Backend Development Log - Error Details]:', err);
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    const message = field === 'email'
      ? 'Email is already registered. Please login.'
      : `An account with this ${field} (${value}) is already registered.`;
    return sendResponse(res, 409, false, message);
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendResponse(res, 400, false, messages.join(', '));
  }

  // Handle Mongoose Cast Errors (Invalid ID)
  if (err.name === 'CastError') {
    return sendResponse(res, 400, false, `Invalid format for field: ${err.path}`);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendResponse(res, 401, false, 'Authentication session expired or invalid. Please login again.');
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const userMessage = err.message || 'Database or server connection failed. Please try again.';

  return sendResponse(res, statusCode, false, userMessage);
};

module.exports = errorHandler;
