import express from 'express';
import { getAttendanceHistory } from '../controllers/attendance.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/history', protect, admin, getAttendanceHistory);

export default router;
