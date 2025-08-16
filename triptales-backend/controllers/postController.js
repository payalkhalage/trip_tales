import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const createPost = async (req, res) => {
  const conn = await db.getConnection();

  try {
    let {
      title,
      location,
      latitude,
      longitude,
      experience,
      budget,
      duration,
      season,
    } = req.body;

    const userId = req.user?.id || 1;

    if (!title || !location || !experience || !budget) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ Parse latitude/longitude or set null
    latitude = latitude ? parseFloat(latitude) : null;
    longitude = longitude ? parseFloat(longitude) : null;
    duration = duration ? parseInt(duration) : null;
    budget = budget ? parseFloat(budget) : null;

    await conn.beginTransaction();

    const [result] = await conn.query(
      `
      INSERT INTO posts (user_id, title, location_name, latitude, longitude, experience, budget, duration_days, best_season)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [userId, title, location, latitude, longitude, experience, budget, duration, season]
    );

    const postId = result.insertId;

    if (req.files?.length) {
      const uploadDir = path.join('public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, file.buffer);
        const imageUrl = `/uploads/${filename}`;

        await conn.query(
          'INSERT INTO post_images (post_id, image_url) VALUES (?, ?)',
          [postId, imageUrl]
        );
      }
    }

    await conn.commit();
    conn.release();

    res.status(201).json({ message: 'Post created successfully', postId });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT p.*, GROUP_CONCAT(pi.image_url) AS images
      FROM posts p
      LEFT JOIN post_images pi ON pi.post_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const formatted = posts.map(post => ({
      ...post,
      images: post.images ? post.images.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*, 
        GROUP_CONCAT(pi.image_url) AS images,
        (
          SELECT es.generated_link 
          FROM experience_summary es 
          WHERE es.post_id = p.id AND es.status = 'Active' 
          ORDER BY es.created_at DESC 
          LIMIT 1
        ) AS generated_link
      FROM posts p
      LEFT JOIN post_images pi ON pi.post_id = p.id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    const posts = rows.map(post => ({
      ...post,
      images: post.images ? post.images.split(',').filter(img => img.trim() !== '') : [],
    }));

    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};


export const getUserPosts = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [posts] = await db.query(`
      SELECT p.*, GROUP_CONCAT(pi.image_url) AS images
      FROM posts p
      LEFT JOIN post_images pi ON pi.post_id = p.id
      WHERE p.user_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [userId]);

    const formatted = posts.map(post => ({
      ...post,
      images: post.images ? post.images.split(',') : []
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
};


export const updatePost = async (req, res) => {
  const userId = req.user?.id;
  const postId = req.params.id;
  const {
    title,
    location,
    latitude,
    longitude,
    experience,
    budget,
    duration,
    season
  } = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Check ownership
    const [[post]] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== userId) return res.status(403).json({ message: 'Forbidden' });

    await db.query(`
      UPDATE posts SET 
        title = ?,
        location_name = ?,
        latitude = ?,
        longitude = ?,
        experience = ?,
        budget = ?,
        duration_days = ?,
        best_season = ?
      WHERE id = ?
    `, [
      title,
      location,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      experience,
      budget ? parseFloat(budget) : null,
      duration ? parseInt(duration) : null,
      season,
      postId
    ]);

    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};


export const deletePost = async (req, res) => {
  const userId = req.user?.id;
  const postId = req.params.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Check ownership
    const [[post]] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== userId) return res.status(403).json({ message: 'Forbidden' });

    // Delete related images (optional)
    await db.query('DELETE FROM post_images WHERE post_id = ?', [postId]);

    // Delete the post
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};


