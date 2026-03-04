import express from "express";
import multer from "multer";
import {
  getAllVets,
  getVetById,
  createVetProfile,
  updateVetProfile,
  deleteVetProfile,
} from "../controllers/vetProfileController.js";
import Vet from "../models/VetProfile.js";
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




router.get("/", getAllVets);


router.get("/user/:userId", protect, async (req, res) => {
  try {

    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const vets = await Vet.find({ user: req.params.userId });
    res.json({ vets });
  } catch (err) {
    console.error("Error fetching vets for user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", getVetById);


router.post("/create", protect, upload.single("profilePhoto"), createVetProfile);


router.put("/:id", protect, upload.single("profilePhoto"), updateVetProfile);


router.delete("/:id", protect, deleteVetProfile);

export default router;
