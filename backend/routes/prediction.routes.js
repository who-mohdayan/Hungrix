import express from 'express';
import { 
  getPredictions, 
  getDemandForecast, 
  getAnomalies, 
  getInsights,
  getTodayPrediction,
  getMenuPopularityScorePreview,
  getTodayMenuItems
} from '../controllers/prediction.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getPredictions);
router.get('/today-menu-items', protect, admin, getTodayMenuItems);
router.get('/menu-popularity-score', protect, admin, getMenuPopularityScorePreview);
router.post('/today', protect, admin, getTodayPrediction);
router.get('/demand-forecast', protect, admin, getDemandForecast);
router.get('/anomalies', protect, admin, getAnomalies);
router.get('/insights', protect, admin, getInsights);

export default router;
