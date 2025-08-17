import express from 'express';
import db from '../config/db.js';

const router = express.Router();

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
      res.json({ postId, bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Not bookmarked yet -> insert
      await db.query(`INSERT INTO bookmarks (post_id, user_id) VALUES (?, ?)`, [postId, userId]);
      res.json({ postId, bookmarked: true, message: 'Bookmarked' });
    }
  } catch (err) {
    console.error('Bookmark toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Get full post details for bookmarked posts
    const [bookmarkedPosts] = await db.query(
      `SELECT p.* 
       FROM bookmarks b
       JOIN posts p ON b.post_id = p.id
       WHERE b.user_id = ?`,
      [userId]
    );

    res.json(bookmarkedPosts);
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;

