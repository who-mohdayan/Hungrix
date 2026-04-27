import express from 'express';
import { 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getStudentStats 
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/students', protect, admin, getAllStudents);
router.get('/students/:id', protect, getStudentById);
router.put('/students/:id', protect, admin, updateStudent);
router.delete('/students/:id', protect, admin, deleteStudent);
router.get('/students/:id/stats', protect, getStudentStats);

export default router;
