import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Toggle helpful/unhelpful
router.post('/toggle', async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [existing] = await db.query(
      `SELECT * FROM helpfuls WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    if (existing.length > 0) {
      // Already marked helpful -> remove
      await db.query(`DELETE FROM helpfuls WHERE post_id = ? AND user_id = ?`, [postId, userId]);
      res.json({ message: 'Helpful mark removed' });
    } else {
      // Not marked yet -> insert
      await db.query(`INSERT INTO helpfuls (post_id, user_id) VALUES (?, ?)`, [postId, userId]);
      res.json({ message: 'Marked helpful' });
    }
  } catch (err) {
    console.error('Helpful toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all helpful marks (optionally filter by userId)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = `SELECT * FROM helpfuls`;
    let params = [];

    if (userId) {
      query += ` WHERE user_id = ?`;
      params.push(userId);
    }

    const [helpfuls] = await db.query(query, params);
    res.json(helpfuls);
  } catch (err) {
    console.error('Get helpful marks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
