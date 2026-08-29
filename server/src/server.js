const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const connectDB = require('./config/db');
const initSocketIO = require('./sockets/chatSocket');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Connect to MongoDB Atlas
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with relaxed CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});
initSocketIO(io);

// Store io instance on app for controllers (req.app.get('io'))
app.set('io', io);

// Security & CORS Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: true, // Allow all origins (localhost:3000, 3001, 3002)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Neighborly API operational' });
});

// Apply Rate Limiting to API
app.use('/api', apiLimiter);

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tools', require('./routes/toolRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/help', require('./routes/helpRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Neighborly Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
