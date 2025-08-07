import express from 'express';
import { generateSummary} from '../controllers/summaryController.js';
import {getSummaryById } from '../controllers/summaryController.js';
const router = express.Router();

router.post('/:postId/generate', generateSummary); // POST to generate
router.get('/:id',getSummaryById);         // GET summary by link

export default router;
