// Vercel Serverless Function Entry Point
const app = require('../src/server');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  // Ensure database is connected before handling requests
  await connectDB();
  return app(req, res);
};
