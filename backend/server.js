import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import menuRoutes from './routes/menu.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import predictionRoutes from './routes/prediction.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Import error handler
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

const isVercelOrigin = (origin) => {
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || isVercelOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Campus Food Intelligence System API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-food-db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
