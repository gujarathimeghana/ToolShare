const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS to use Google / Cloudflare public DNS to bypass Windows SRV resolution block
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Custom DNS set error:', e.message);
}

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI || 'mongodb+srv://meghaveni236_db_user:123user123@cluster0.zraxqfo.mongodb.net/neighborly?retryWrites=true&w=majority';

  console.log('[MongoDB]: Connecting to MongoDB Atlas Cluster0...');

  try {
    const conn = await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`[MongoDB Atlas Connected Successfully]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Atlas Connection Error]: ${error.message}`);
  }
};

module.exports = connectDB;
