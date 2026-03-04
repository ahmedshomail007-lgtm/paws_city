import express from "express";
import multer from "multer";
import {
  getAllGroomingProfiles,
  getGroomingProfileById,
  createGroomingProfile,
  updateGroomingProfile,
  deleteGroomingProfile,
} from "../controllers/groomingProfileController.js";
import GroomingProfile from "../models/GroomingProfile.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Public routes
router.get("/", getAllGroomingProfiles);
router.get("/:id", getGroomingProfileById);

// Get grooming profiles for a specific user
router.get("/user/:userId", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const groomingProfiles = await GroomingProfile.find({ user: req.params.userId });
    res.json({ groomingProfiles });
  } catch (err) {
    console.error("Error fetching grooming profiles for user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected routes (user must be logged in)
router.post("/create", protect, upload.single("shopImage"), createGroomingProfile);
router.put("/:id", protect, upload.single("shopImage"), updateGroomingProfile);
router.delete("/:id", protect, deleteGroomingProfile);

export default router;
