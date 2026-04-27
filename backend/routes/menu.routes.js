import express from 'express';
import { 
  getAllMenus, 
  getMenuByDate, 
  getMenuById, 
  createMenu, 
  updateMenu, 
  deleteMenu 
} from '../controllers/menu.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllMenus);
router.get('/date/:date', getMenuByDate);
router.get('/:id', getMenuById);
router.post('/', protect, admin, createMenu);
router.put('/:id', protect, admin, updateMenu);
router.delete('/:id', protect, admin, deleteMenu);

export default router;
