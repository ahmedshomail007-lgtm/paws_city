import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ensure you have User model

export const requireAuth = async (req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ error: "Unauthorized, invalid token" });
  }
};

// Alias for protect function used in routes
export const protect = requireAuth;
