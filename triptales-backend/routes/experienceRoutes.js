import express from 'express';
//1lines
// import db from "../config/db.js"; 

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

// // feedback

// // Add / Update Experience (One per user)
// router.post("/add", async (req, res) => {
//   try {
//     const { user_id, experience } = req.body;

//     const query = `
//       INSERT INTO user_experiences (user_id, experience)
//       VALUES (?, ?)
//       ON DUPLICATE KEY UPDATE experience = VALUES(experience), updated_at = CURRENT_TIMESTAMP
//     `;

//     await db.query(query, [user_id, experience]);
//     res.json({ success: true, message: "Experience saved successfully" });

//   } catch (err) {
//     console.error("Error saving experience:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Fetch all user experiences (for Admin)
// router.get("/all", async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT ue.id, ue.experience, ue.created_at, u.username, u.email 
//        FROM user_experiences ue
//        JOIN users u ON ue.user_id = u.id
//        ORDER BY ue.created_at DESC`
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching experiences:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });



export default router;