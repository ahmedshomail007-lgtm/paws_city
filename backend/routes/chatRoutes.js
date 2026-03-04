import express from "express";
import { chatWithCohere } from "../controllers/chatController.js";

const router = express.Router();

// Chat endpoint
router.post("/chat", chatWithCohere);

export default router;