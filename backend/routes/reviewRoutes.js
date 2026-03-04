import express from "express";
import { addReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:targetId", getReviews);
router.delete("/:reviewId", protect, deleteReview);

export default router;
