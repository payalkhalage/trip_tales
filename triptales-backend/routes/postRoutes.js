// // import express from 'express';
// // import multer from 'multer';
// // import { createPost, getAllPosts } from '../controllers/postController.js';

// // const router = express.Router();

// // // Initialize multer to store files in memory
// // const storage = multer.memoryStorage();
// // const upload = multer({ storage });

// // // Routes
// // router.post('/', upload.array('images', 10), createPost);
// // router.get('/', getAllPosts); // Optional: for PostDashboard

// // export default router;



// import express from 'express';
// import multer from 'multer';
// import { authenticateToken } from '../Middleware/auth.js';
// import { createPost, getPosts ,getUserPosts,updatePost,deletePost} from '../controllers/postController.js'; // use getPosts

// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Routes
// router.post('/', upload.array('images', 10), createPost);
// router.get('/', getPosts); // ✅ Use getPosts instead of getAllPosts

// export default router;



import express from 'express';
import multer from 'multer';
import { authenticateToken } from "../Middleware/auth.js";
import {
  createPost,
  getPosts,
  getUserPosts,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route to get all posts (dashboard)
router.get('/', getPosts);

// Protected routes:
router.post('/', authenticateToken, upload.array('images', 10), createPost);
router.get('/user', authenticateToken, getUserPosts);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;
