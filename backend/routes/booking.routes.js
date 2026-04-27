import express from 'express';
import { 
  getAllBookings, 
  getMyBookings, 
  getBookingById, 
  createBooking, 
  cancelBooking,
  markAsAttended,
  markAsMissed,
  getBookingsByDate
} from '../controllers/booking.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllBookings);
router.get('/my-bookings', protect, getMyBookings);
router.get('/date/:date', protect, admin, getBookingsByDate);
router.get('/:id', protect, getBookingById);
router.post('/', protect, createBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/attend', protect, admin, markAsAttended);
router.put('/:id/miss', protect, admin, markAsMissed);

export default router;
