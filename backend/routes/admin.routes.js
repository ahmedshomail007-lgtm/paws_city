import express from "express";
import {
  adminRegister,
  adminLogin,
  adminLogout,
  getAdminProfile,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllVetProfiles,
  getVetProfileDetails,
  approveVetProfile,
  rejectVetProfile,
  getAllPets,
  getPetDetails,
  approvePet,
  rejectPet,
  getAllGroomingProfiles,
  getGroomingProfileDetails,
  approveGroomingProfile,
  rejectGroomingProfile
} from "../controllers/adminController.js";
import { requireAdminAuth } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/profile", requireAdminAuth, getAdminProfile);

// Dashboard
router.get("/dashboard/stats", requireAdminAuth, getDashboardStats);

// User Management
router.get("/users", requireAdminAuth, getAllUsers);
router.delete("/users/:userId", requireAdminAuth, deleteUser);

// Vet Profile Management  
router.get("/vet-profiles", requireAdminAuth, getAllVetProfiles);
router.get("/vet-profiles/:vetId", requireAdminAuth, getVetProfileDetails);
router.put("/vet-profiles/:vetId/approve", requireAdminAuth, approveVetProfile);
router.put("/vet-profiles/:vetId/reject", requireAdminAuth, rejectVetProfile);

// Pet Management
router.get("/pets", requireAdminAuth, getAllPets);
router.get("/pets/:petId", requireAdminAuth, getPetDetails);
router.put("/pets/:petId/approve", requireAdminAuth, approvePet);
router.put("/pets/:petId/reject", requireAdminAuth, rejectPet);

// Grooming Profile Management
router.get("/grooming-profiles", requireAdminAuth, getAllGroomingProfiles);
router.get("/grooming-profiles/:groomingId", requireAdminAuth, getGroomingProfileDetails);
router.put("/grooming-profiles/:groomingId/approve", requireAdminAuth, approveGroomingProfile);
router.put("/grooming-profiles/:groomingId/reject", requireAdminAuth, rejectGroomingProfile);

export default router;