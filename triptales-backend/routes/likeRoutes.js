import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Toggle like/unlike
router.post('/toggle', async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [existing] = await db.query(
      `SELECT * FROM likes WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    if (existing.length > 0) {
      // Already liked -> remove
      await db.query(`DELETE FROM likes WHERE post_id = ? AND user_id = ?`, [postId, userId]);
      res.json({ message: 'Unliked' });
    } else {
      // Not liked yet -> insert
      await db.query(`INSERT INTO likes (post_id, user_id) VALUES (?, ?)`, [postId, userId]);
      res.json({ message: 'Liked' });
    }
  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all likes
router.get('/', async (req, res) => {
  try {
    const [likes] = await db.query(`SELECT * FROM likes`);
    res.json(likes);
  } catch (err) {
    console.error('Get likes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
