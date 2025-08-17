import db from '../config/db.js';

export const createExperience = async (req, res) => {
  try {
    const { experience } = req.body;
    const userId = req.user.id;

    if (!experience || typeof experience !== 'string' || experience.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Experience content is required' 
      });
    }

  const [result] = await db.query(
  `INSERT INTO user_experiences (user_id, experience, created_at, updated_at)
   VALUES (?, ?, NOW(), NOW())
   ON DUPLICATE KEY UPDATE 
     experience = VALUES(experience),
     updated_at = NOW()`,
  [userId, experience]
);

// Fetch the single row for this user
const [newExp] = await db.query(
  'SELECT * FROM user_experiences WHERE user_id = ?',
  [userId]
);


    res.status(201).json({
      success: true,
      data: newExp[0]
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create experience'
    });
  }
};

export const getUserExperiences = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT * FROM user_experiences WHERE user_id = ? LIMIT 1',
      [userId]
    );

    res.json({
      success: true,
      data: rows[0] || null
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience'
    });
  }
};


export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const [existing] = await db.query(
      `SELECT user_id FROM user_experiences WHERE id = ?`,
      [id]
    );

    if (!existing[0]) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    if (existing[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this experience'
      });
    }

    // Update experience
    await db.query(
      `UPDATE user_experiences 
       SET experience = ? 
       WHERE id = ?`,
      [experience, id]
    );

    // Get updated experience
    const [updated] = await db.query(
      `SELECT * FROM user_experiences WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update experience'
    });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const [existing] = await db.query(
      `SELECT user_id FROM user_experiences WHERE id = ?`,
      [id]
    );

    if (!existing[0]) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    if (existing[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this experience'
      });
    }

    // Delete experience
    await db.query(
      `DELETE FROM user_experiences WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience'
    });
  }
};