/**
 * Run with: npm run seed
 */
import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const run = async () => {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  const users = [
    { name: "Admin", email: "admin@pawscity.com", password: "admin123", role: "admin" },
    { name: "User", email: "user@pawscity.com", password: "user123", role: "user" }
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ name: u.name, email: u.email, password: hashed, role: u.role });
    console.log("Created", u.email);
  }

  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
