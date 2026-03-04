import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server will continue without database. Some features may not work.");
    // Don't exit process - allow server to run without DB for development
  }
};

export default connectDB;
