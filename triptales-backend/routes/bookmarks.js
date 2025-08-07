import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Toggle bookmark/unbookmark
router.post('/toggle', async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [existing] = await db.query(
      `SELECT * FROM bookmarks WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    if (existing.length > 0) {
      // Already bookmarked -> remove
      await db.query(`DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?`, [postId, userId]);
      res.json({ message: 'Bookmark removed' });
    } else {
      // Not bookmarked yet -> insert
      await db.query(`INSERT INTO bookmarks (post_id, user_id) VALUES (?, ?)`, [postId, userId]);
      res.json({ message: 'Bookmarked' });
    }
  } catch (err) {
    console.error('Bookmark toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookmarks (optionally filter by userId if provided via query)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = `SELECT * FROM bookmarks`;
    let params = [];

    if (userId) {
      query += ` WHERE user_id = ?`;
      params.push(userId);
    }

    const [bookmarks] = await db.query(query, params);
    res.json(bookmarks);
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
