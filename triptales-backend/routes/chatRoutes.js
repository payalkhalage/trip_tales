import express from "express";
import db from "../config/db.js";
import { io } from "../server.js";

const router = express.Router();

// Get or create chat for a post
router.post("/init", async (req, res) => {
  try {
    const { postId, userId } = req.body;
    
    // Check if chat exists
    const [existingChat] = await db.query(
      "SELECT id FROM chats WHERE post_id = ?",
      [postId]
    );

    let chatId;
    if (existingChat.length > 0) {
      chatId = existingChat[0].id;
    } else {
      // Create new chat
      const [result] = await db.query(
        "INSERT INTO chats (post_id) VALUES (?)",
        [postId]
      );
      chatId = result.insertId;
      
      // Add post owner as participant
      const [post] = await db.query(
        "SELECT user_id FROM posts WHERE id = ?",
        [postId]
      );
      if (post.length > 0) {
        await db.query(
          "INSERT INTO chat_participants (chat_id, user_id) VALUES (?, ?)",
          [chatId, post[0].user_id]
        );
      }
    }

    // Add current user as participant if not already
    const [existingParticipant] = await db.query(
      "SELECT 1 FROM chat_participants WHERE chat_id = ? AND user_id = ?",
      [chatId, userId]
    );
    if (existingParticipant.length === 0) {
      await db.query(
        "INSERT INTO chat_participants (chat_id, user_id) VALUES (?, ?)",
        [chatId, userId]
      );
    }

    res.json({ chatId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to initialize chat" });
  }
});

// Get user's conversations
// Get user's conversations - FIXED QUERY
router.get("/conversations", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const [conversations] = await db.query(`
  SELECT 
    c.id,
    c.post_id,
    ANY_VALUE(p.title) as post_title,
    ANY_VALUE(u.id) as other_user_id,
    ANY_VALUE(u.username) as other_user_username,
    (SELECT body FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_body,
    (SELECT COUNT(*) FROM messages m 
     WHERE m.chat_id = c.id AND m.sender_id != ? AND 
     (m.created_at > cp.last_seen OR cp.last_seen IS NULL)) as my_unread
  FROM chat_participants cp
  JOIN chats c ON c.id = cp.chat_id
  JOIN posts p ON p.id = c.post_id
  JOIN chat_participants cp2 ON cp2.chat_id = c.id AND cp2.user_id != ?
  JOIN users u ON u.id = cp2.user_id
  WHERE cp.user_id = ?
  GROUP BY c.id
  ORDER BY (SELECT MAX(created_at) FROM messages WHERE chat_id = c.id) DESC
`, [userId, userId, userId]);


    res.json({ conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get messages for a chat - FIXED ENDPOINT
router.get("/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Update last seen
    await db.query(
      "UPDATE chat_participants SET last_seen = NOW() WHERE chat_id = ? AND user_id = ?",
      [chatId, userId]
    );

    const [messages] = await db.query(
      `SELECT m.id, m.sender_id, m.body, m.created_at, u.username as sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE chat_id = ?
       ORDER BY m.created_at ASC`,
      [chatId]
    );
    
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a message - FIXED ENDPOINT
router.post("/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender_id, body } = req.body;

    if (!body || !sender_id) {
      return res.status(400).json({ error: "sender_id and body required" });
    }

    const [result] = await db.query(
      "INSERT INTO messages (chat_id, sender_id, body) VALUES (?, ?, ?)",
      [chatId, sender_id, body]
    );

    const [rows] = await db.query(
      `SELECT m.id, m.sender_id, m.body, m.created_at, u.username as sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.id = ?`,
      [result.insertId]
    );

    const message = rows[0];

    // Broadcast via Socket.IO
    io.to(`chat_${chatId}`).emit("receiveMessage", message);

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;