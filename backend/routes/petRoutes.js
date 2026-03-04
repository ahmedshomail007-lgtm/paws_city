import express from "express";
import { addPet, getAllPets, getUserPets, getPetById, updatePet, deletePet, getVolunteerPets } from "../controllers/petController.js";
import { protect } from "../middlewares/authMiddleware.js"; // JWT auth
import multer from "multer";

const router = express.Router();

// Multer memory storage for Cloudinary uploads
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

// Routes
router.post("/", protect, upload.single("image"), addPet);
router.get("/marketplace", getAllPets); // Public route for marketplace
router.get("/volunteer", getVolunteerPets); // Public route for volunteer pets
router.get("/user", protect, getUserPets); // User's own pets
router.get("/:id", getPetById); // Make this public for viewing
router.put("/:id", protect, upload.single("image"), updatePet); // Update pet
router.delete("/:id", protect, deletePet);

export default router;
