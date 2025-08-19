// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import postRoutes from './routes/postRoutes.js';
// import locationRoutes from './routes/location.js';
// import summaryRoutes from './routes/summaryRoutes.js';
// import authRoutes from './routes/auth.js';
// import commentRoutes from './routes/commentRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import likeRoutes from './routes/likeRoutes.js';
// import bookmarksRoutes from './routes/bookmarks.js';
// import helpfulsRoutes from './routes/helpfuls.js';
// import experienceRoutes from './routes/experienceRoutes.js';
// import feedbackRoutes from "./routes/feedbackRoutes.js";
// import announceRoutes from "./routes/announceRoutes.js"
// const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//    allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static uploads
// app.use('/uploads', express.static(path.join('public', 'uploads')));

// // Routes
// app.use('/api/posts', postRoutes);
// app.use('/api', locationRoutes);
// app.use('/api/summary', summaryRoutes);
// app.use('/api', authRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/likes', likeRoutes);
// app.use('/api/bookmarks', bookmarksRoutes);
// app.use('/api/helpfuls', helpfulsRoutes);
// app.use('/api/experiences', experienceRoutes);
// app.use("/api/feedback", feedbackRoutes);
// app.use('/api/announcements', (req, res, next) => {
//   console.log("📢 Hit /api/announcements route:", req.method, req.url);
//   next();
// }, announceRoutes);

// app.listen(5000, () => {
//   console.log('Backend running on http://localhost:5000');
// });

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import postRoutes from "./routes/postRoutes.js";
import locationRoutes from "./routes/location.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import bookmarksRoutes from "./routes/bookmarks.js";
import helpfulsRoutes from "./routes/helpfuls.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import announceRoutes from "./routes/announceRoutes.js"

import db from "./config/db.js";

// --- Fix for __dirname in ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// --- Socket.IO setup ---
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST"],
    credentials: true,
   
  },
});

// Make io available to other modules if needed
export { io };

// --- Socket.IO Events ---
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  // Join chat room
  socket.on("joinChat", async ({ chatId, userId }) => {
    try {
      socket.join(`chat_${chatId}`);
      console.log(`User ${userId} joined chat_${chatId}`);

      // Mark messages as read
      await db.query(
        "UPDATE chat_participants SET last_seen = NOW() WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );

      // Send chat history
      const [messages] = await db.query(
        `SELECT m.id, m.sender_id, m.body, m.created_at, u.username AS sender_name
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE chat_id = ?
         ORDER BY m.created_at ASC`,
        [chatId]
      );

      socket.emit("chatHistory", messages);
    } catch (err) {
      console.error("❌ Error joining chat:", err);
    }
  });

  // Handle sending message
  socket.on("sendMessage", async ({ chatId, senderId, body }) => {
    try {
      const [result] = await db.query(
        "INSERT INTO messages (chat_id, sender_id, body) VALUES (?, ?, ?)",
        [chatId, senderId, body]
      );

      const [rows] = await db.query(
        `SELECT m.id, m.sender_id, m.body, m.created_at, u.username AS sender_name
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE m.id = ?`,
        [result.insertId]
      );

      const message = rows[0];

      // Broadcast to all in the room
      io.to(`chat_${chatId}`).emit("receiveMessage", message);

      // Update unread counts for other participants
      await db.query(
        `UPDATE chat_participants 
         SET unread_count = unread_count + 1 
         WHERE chat_id = ? AND user_id != ?`,
        [chatId, senderId]
      );
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// --- Test database connection ---
const testDbConnection = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("✅ Connected to database");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};
testDbConnection();

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// --- Routes ---
app.use("/api/posts", postRoutes);
app.use("/api", locationRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/helpfuls", helpfulsRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/announcements', (req, res, next) => {
  console.log("📢 Hit /api/announcements route:", req.method, req.url);
  next();
}, announceRoutes);

app.use("/api/chats", chatRoutes); // REST API for chats/messages

// --- Start server ---
httpServer.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
