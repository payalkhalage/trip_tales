
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Use your Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAFClKqdZ5_LOkqQb8PfVeBY4rztpVz_ow");

export const generateSummary = async (req, res) => {
  const { postId } = req.params;

  try {
    const [postRows] = await db.query(`
      SELECT p.*, GROUP_CONCAT(pi.image_url) AS images
      FROM posts p
      LEFT JOIN post_images pi ON pi.post_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [postId]);

    if (!postRows.length) return res.status(404).json({ message: 'Post not found' });

    const post = postRows[0];
    const images = post.images ? post.images.split(',') : [];

    // 🧠 Build AI prompt
    const prompt = `
Create a short 2–3 sentence travel summary from this trip data:
- Title: ${post.title}
- Location: ${post.location_name}
- Duration: ${post.duration_days || 'N/A'} days
- Budget: ₹${post.budget}
- Experience: ${post.experience}

Focus on: hotel quality, food, views, activities — and summarize nicely.
`;

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    // 🔗 Generate unique shareable link
    const shortId = uuidv4().slice(0, 8);
    const link = `summary/${shortId}`;

    // 💾 Save to DB
    await db.query(
      `INSERT INTO experience_summary (post_id, summary_text, generated_link, status)
       VALUES (?, ?, ?, ?)`,
      [postId, summary, shortId, 'Active']
    );

    // ✅ Respond to frontend
    res.status(201).json({
      message: "Summary generated successfully",
      summary,
      link: `http://localhost:5173/summary/${shortId}`,
      shortId,
      mainImages: images.slice(0, 2)
    });

  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ message: "Summary generation failed" });
  }
};


export const getSummaryById = async (req, res) => {
  const { id } = req.params;  // id here means generated_link

  try {
    const [rows] = await db.query(
      `SELECT es.*, p.title, p.location_name, p.duration_days, p.budget
       FROM experience_summary es
       JOIN posts p ON es.post_id = p.id
       WHERE es.generated_link = ?`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: "Summary not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

