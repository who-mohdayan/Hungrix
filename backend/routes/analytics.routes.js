import express from 'express';
import { 
  getAnalytics, 
  getMealPopularity, 
  getSustainabilityMetrics,
  getStudentAccountability,
  getOverviewStats,
  getRealtimeAnalytics,
  getBookingHeatmap,
  getComparativeAnalysis
} from '../controllers/analytics.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getAnalytics);
router.get('/meal-popularity', protect, admin, getMealPopularity);
router.get('/sustainability', protect, admin, getSustainabilityMetrics);
router.get('/student-accountability', protect, admin, getStudentAccountability);
router.get('/overview', protect, admin, getOverviewStats);
router.get('/realtime', protect, admin, getRealtimeAnalytics);
router.get('/heatmap', protect, admin, getBookingHeatmap);
router.get('/comparative', protect, admin, getComparativeAnalysis);

export default router;
