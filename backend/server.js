import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import vetProfileRoutes from "./routes/vetProfileRoutes.js";
import groomingProfileRoutes from "./routes/groomingProfileRoutes.js";
import petRoutes from "./routes/petRoutes.js"; // <-- AddPets routes
import chatRoutes from "./routes/chatRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// Models
import Admin from "./models/Admin.js";
import User from "./models/User.js";
import Pet from "./models/Pet.js";
import VetProfile from "./models/VetProfile.js";
import GroomingProfile from "./models/GroomingProfile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/vet-profiles", vetProfileRoutes);
app.use("/api/grooming-profiles", groomingProfileRoutes);
app.use("/api/pets", petRoutes);
app.use("/api", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", debugRoutes);



app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ error: err.message || "Server Error" });
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
