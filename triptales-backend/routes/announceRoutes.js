import express from "express";
import { getAnnouncements, createAnnouncement, deleteAnnouncement,markAnnouncementSeen } from "../controllers/announcementController.js";
import { authenticateToken } from "../Middleware/auth.js";

const router = express.Router();

router.get("/",authenticateToken, getAnnouncements);

router.post("/", authenticateToken, createAnnouncement);
router.delete("/:id", authenticateToken, deleteAnnouncement);
router.post("/seen", authenticateToken, markAnnouncementSeen);

export default router;
