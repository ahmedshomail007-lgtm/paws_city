import express from "express";
import multer from "multer";
import { register, login, logout, me, uploadProfilePicture, updateProfile, deleteAccount } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer memory storage setup for Cloudinary uploads
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for Cloudinary
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/upload-profile-picture", requireAuth, upload.single("profilePicture"), uploadProfilePicture);
router.put("/update-profile", requireAuth, updateProfile);
router.delete("/delete", requireAuth, deleteAccount);

export default router;
