import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:petId", getComments);
router.delete("/:commentId", protect, deleteComment);

export default router;
