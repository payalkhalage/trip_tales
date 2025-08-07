
// import express from 'express';
// import db from '../config/db.js';
// const router = express.Router();

// // Add a comment and create a notification
// router.post('/', async (req, res) => {
//   const { postId, userId, content } = req.body;

//   try {
//     const [postResult] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
//     if (postResult.length === 0) return res.status(404).json({ message: 'Post not found' });

//     const postOwnerId = postResult[0].user_id;

//     // Insert the comment
//     await db.query('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', [postId, userId, content]);

//     // Add notification for post owner (skip if user comments on own post)
//     if (userId !== postOwnerId) {
//       await db.query(
//         'INSERT INTO notifications (receiver_id, sender_id, post_id, type) VALUES (?, ?, ?, "comment")',
//         [postOwnerId, userId, postId]
//       );
//     }

//     res.status(201).json({ message: 'Comment added and notification sent' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get all comments for a post
// router.get('/:postId', async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const [comments] = await db.query(
//       `SELECT c.*, u.name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC`,
//       [postId]
//     );
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;



import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Create a comment
router.post('/', async (req, res) => {
  const { postId, userId, commentText } = req.body;

  if (!postId || !userId || !commentText) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    await db.query(
      `INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)`,
      [postId, userId, commentText]
    );

    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments for a post
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const [results] = await db.query(
      `SELECT c.id, c.comment_text, c.created_at, u.name AS username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at DESC`,
      [postId]
    );

    res.json(results);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
