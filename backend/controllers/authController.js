import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const cookieOptions = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: (Number(process.env.JWT_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000)
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken({ id: user._id });
    res.cookie("jwt", token, cookieOptions(req)).status(201).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profilePicture: user.profilePicture,
        profilePictureUrl: user.profilePicture || null
      },
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken({ id: user._id });
    res.cookie("jwt", token, cookieOptions(req)).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profilePicture: user.profilePicture,
        profilePictureUrl: user.profilePicture || null
      },
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt").json({ message: "Logged out" });
};

export const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const user = await User.findById(req.user._id).select("-password");
  
  // Add profile picture URL for easier frontend consumption
  const userResponse = {
    ...user.toObject(),
    profilePictureUrl: user.profilePicture || null
  };
  
  res.json({ user: userResponse });
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const userId = req.user._id;
    const { uploadToCloudinary } = await import("../config/cloudinary.js");
    const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");

    // Get current user to check for existing profile picture
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Upload new image to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer, 
      'paws_city/profiles', 
      req.file.originalname
    );

    // Update user's profile picture in database with Cloudinary URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    // Delete old profile picture from Cloudinary if it exists
    if (currentUser.profilePicture && currentUser.profilePicture.includes('cloudinary')) {
      try {
        await deleteCloudinaryImage(currentUser.profilePicture);
        console.log(`✅ Deleted old user profile picture from Cloudinary`);
      } catch (error) {
        console.log(`⚠️ Could not delete old user profile picture from Cloudinary:`, error.message);
      }
    }

    res.json({
      message: "Profile picture uploaded successfully",
      user: {
        ...user.toObject(),
        profilePictureUrl: uploadResult.secure_url
      }
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        ...user.toObject(),
        profilePictureUrl: user.profilePicture || null
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");

    // Get user data before deletion to clean up profile picture
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user's profile picture from Cloudinary if it exists
    if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
      try {
        await deleteCloudinaryImage(user.profilePicture);
        console.log(`✅ Deleted user profile picture from Cloudinary during account deletion`);
      } catch (error) {
        console.log(`⚠️ Could not delete user profile picture from Cloudinary during account deletion:`, error.message);
      }
    }

    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Clear cookie and send response
    res.clearCookie("jwt").json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Server error" });
  }
};
