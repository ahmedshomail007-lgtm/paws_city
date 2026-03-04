// Simple test to see if the server starts without the problematic chat controller
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});