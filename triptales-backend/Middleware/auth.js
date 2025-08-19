// middleware/auth.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || '73d67213c53f18b47c38f7bf3c7a3221c1ffac0fd3a52659f43d49e75f162dc3b28b9966b1fd573f35d1b575450d954cdff5276078bc8559b902f95ef7771576';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//   if (err) return res.status(403).json({ message: "Invalid or expired token." });
//   req.user = user; // ✅ user will have id, username, name
//   next();
// });


// };

jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT Error:", err.message); // Debug: Log why JWT failed
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      }
      return res.status(403).json({ message: 'Invalid token.' });
    }
    
    console.log("Decoded user:", user); // Debug: Check token payload
    req.user = user;
    next();
  });
};
