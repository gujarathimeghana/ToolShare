const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS to use Google / Cloudflare public DNS to bypass Windows SRV resolution block
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Custom DNS set error:', e.message);
}

let cachedPromise = null;

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for Vercel Serverless)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const atlasUri = process.env.MONGO_URI || 'mongodb+srv://meghaveni236_db_user:123user123@cluster0.zraxqfo.mongodb.net/neighborly?retryWrites=true&w=majority';

  console.log('[MongoDB]: Connecting to MongoDB Atlas...');

  try {
    cachedPromise = mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    const conn = await cachedPromise;
    console.log(`[MongoDB Atlas Connected Successfully]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.error(`[MongoDB Atlas Connection Error]: ${error.message}`);
  }
};

module.exports = connectDB;
