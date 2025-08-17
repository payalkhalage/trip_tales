// backend/routes/auth.js
import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../Middleware/auth.js';
import jsonwebtoken from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, username, password, gender, dob, country, role = 'user' } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, username, password, gender, dob, country, role)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [name, email, username, hashedPassword, gender, dob, country, role]);

    res.json({ success: true, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'User already exists or registration failed' });
  }
});



// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Admin hardcoded login (bypass DB)
    if (username === "Admin" && password === "Admin@#11") {
      const token = jwt.sign(
        { id: 0, username: "Admin", role: "admin" },
        process.env.JWT_SECRET || '73d67213c53f18b47c38f7bf3c7a3221c1ffac0fd3a52659f43d49e75f162dc3b28b9966b1fd573f35d1b575450d954cdff5276078bc8559b902f95ef7771576',
        { expiresIn: '24h' }

      );

      return res.json({
        success: true,
        message: "Welcome Admin!",
        token,
        user: {
          id: 0,
          name: "System Admin",
          username: "Admin",
          role: "admin",
        },
        redirectTo: "/AdminDashboard",
      });
    }

    // ✅ Normal user login (DB check)
    const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || '73d67213c53f18b47c38f7bf3c7a3221c1ffac0fd3a52659f43d49e75f162dc3b28b9966b1fd573f35d1b575450d954cdff5276078bc8559b902f95ef7771576',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      redirectTo: '/postdashboard',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});




// GET Logged-in User Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

 const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


export default router;
