import express from 'express';
import { getMealBookingStats } from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/meal-booking-stats', protect, admin, getMealBookingStats);

export default router;
