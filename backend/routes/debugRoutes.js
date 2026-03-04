// Debug route to list uploads - remove this in production
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/debug/uploads", (req, res) => {
  try {
    const uploadsPath = path.resolve("uploads");
    const files = fs.readdirSync(uploadsPath);
    res.json({ 
      uploadsPath, 
      files,
      count: files.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;