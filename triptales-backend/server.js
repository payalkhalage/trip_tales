import express from 'express';
import cors from 'cors';
import path from 'path';
import postRoutes from './routes/postRoutes.js';
import locationRoutes from './routes/location.js';
import summaryRoutes from './routes/summaryRoutes.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/commentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import bookmarksRoutes from './routes/bookmarks.js';
import helpfulsRoutes from './routes/helpfuls.js';
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend dev server
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join('public', 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api', locationRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api',authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/helpfuls', helpfulsRoutes);

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
