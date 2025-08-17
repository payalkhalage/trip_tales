import express from 'express';
import { 
  createExperience,
  getUserExperiences,
  updateExperience,
  deleteExperience
} from '../controllers/experienceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createExperience);
router.get('/', authenticateToken, getUserExperiences);
router.put('/:id', authenticateToken, updateExperience);
router.delete('/:id', authenticateToken, deleteExperience);

export default router;