const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return sendResponse(res, statusCode, false, err.message || 'Internal Server Error');
};

module.exports = errorHandler;
