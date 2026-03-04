import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const requireAdminAuth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.adminJwt || 
                  (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                    ? req.headers.authorization.slice(7) 
                    : null);

    if (!token) {
      return res.status(401).json({ error: "Access denied. No admin token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    // Get admin from database
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      return res.status(401).json({ error: "Admin not found. Please login again." });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: "Admin account is deactivated." });
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid admin token." });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Admin token expired. Please login again." });
    }
    
    console.error("Admin auth middleware error:", error);
    return res.status(500).json({ error: "Server error in admin authentication." });
  }
};

// Optional admin auth - for routes that work with or without admin authentication
export const optionalAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminJwt || 
                  (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                    ? req.headers.authorization.slice(7) 
                    : null);

    if (!token) {
      return next(); // Continue without admin user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (admin && admin.isActive) {
        req.admin = admin;
      }
    }

    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue
    next();
  }
};