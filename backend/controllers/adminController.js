import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import VetProfile from "../models/VetProfile.js";
import GroomingProfile from "../models/GroomingProfile.js";
import { signToken } from "../utils/token.js";

const cookieOptions = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: (Number(process.env.JWT_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000)
});

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }


    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 12);


    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = signToken({ id: admin._id, role: 'admin' });

    res.cookie("adminJwt", token, cookieOptions(req)).status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }


    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    // Generate token
    const token = signToken({ id: admin._id, role: 'admin' });

    res.cookie("adminJwt", token, cookieOptions(req)).json({
      message: "Admin logged in successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      token
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminJwt").json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        isActive: admin.isActive,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Dashboard Analytics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPets = await Pet.countDocuments();
    const totalVets = await VetProfile.countDocuments();
    const totalGroomers = await GroomingProfile.countDocuments();
    
    const pendingVets = await VetProfile.countDocuments({ isApproved: false });
    const approvedVets = await VetProfile.countDocuments({ isApproved: true });
    
    const pendingPets = await Pet.countDocuments({ isApproved: false });
    const approvedPets = await Pet.countDocuments({ isApproved: true });

    const pendingGroomers = await GroomingProfile.countDocuments({ isApproved: false });
    const approvedGroomers = await GroomingProfile.countDocuments({ isApproved: true });

    // User growth data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const recentVets = await VetProfile.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("specialization isApproved createdAt");

    const recentPets = await Pet.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner", "name")
      .select("name breed type isApproved createdAt");

    res.json({
      stats: {
        totalUsers,
        totalPets,
        totalVets,
        totalGroomers,
        pendingVets,
        approvedVets,
        pendingPets,
        approvedPets,
        pendingGroomers,
        approvedGroomers
      },
      userGrowth,
      recentActivity: {
        users: recentUsers,
        vets: recentVets,
        pets: recentPets
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Server error fetching dashboard stats" });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore: page < Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Server error fetching users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Also delete user's pets, vet profile, and grooming profile if exists
    await Pet.deleteMany({ owner: userId });
    await VetProfile.deleteMany({ user: userId });
    await GroomingProfile.deleteMany({ user: userId });
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error deleting user" });
  }
};

// Vet Profile Management
export const getAllVetProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'pending', 'approved', 'rejected'

    let query = {};
    if (status === 'pending') query.isApproved = false;
    else if (status === 'approved') query.isApproved = true;

    const vetProfiles = await VetProfile.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalVets = await VetProfile.countDocuments(query);

    res.json({
      vetProfiles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalVets / limit),
        totalVets,
        hasMore: page < Math.ceil(totalVets / limit)
      }
    });
  } catch (error) {
    console.error("Get vet profiles error:", error);
    res.status(500).json({ error: "Server error fetching vet profiles" });
  }
};

export const getVetProfileDetails = async (req, res) => {
  try {
    const { vetId } = req.params;

    const vetProfile = await VetProfile.findById(vetId)
      .populate({
        path: "user",
        select: "name email phone address profilePicture type status createdAt"
      })
      .populate("approvedBy", "name email")
      .populate("rejectedBy", "name email");

    if (!vetProfile) {
      return res.status(404).json({ error: "Vet profile not found" });
    }

    res.json({
      vetProfile: {
        ...vetProfile.toObject(),
        applicationHistory: {
          submittedAt: vetProfile.createdAt,
          approvedAt: vetProfile.approvedAt,
          rejectedAt: vetProfile.rejectedAt,
          approvedBy: vetProfile.approvedBy,
          rejectedBy: vetProfile.rejectedBy,
          rejectionReason: vetProfile.rejectionReason
        }
      }
    });
  } catch (error) {
    console.error("Get vet profile details error:", error);
    res.status(500).json({ error: "Server error fetching vet profile details" });
  }
};

export const approveVetProfile = async (req, res) => {
  try {
    const { vetId } = req.params;

    const vetProfile = await VetProfile.findByIdAndUpdate(
      vetId,
      { isApproved: true, approvedAt: new Date(), approvedBy: req.admin._id },
      { new: true }
    ).populate("user", "name email");

    if (!vetProfile) {
      return res.status(404).json({ error: "Vet profile not found" });
    }

    res.json({
      message: "Vet profile approved successfully",
      vetProfile
    });
  } catch (error) {
    console.error("Approve vet profile error:", error);
    res.status(500).json({ error: "Server error approving vet profile" });
  }
};

export const rejectVetProfile = async (req, res) => {
  try {
    const { vetId } = req.params;
    const { reason } = req.body;

    const vetProfile = await VetProfile.findByIdAndUpdate(
      vetId,
      { 
        isApproved: false, 
        rejectedAt: new Date(),
        rejectedBy: req.admin._id,
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    ).populate("user", "name email");

    if (!vetProfile) {
      return res.status(404).json({ error: "Vet profile not found" });
    }

    res.json({
      message: "Vet profile rejected",
      vetProfile
    });
  } catch (error) {
    console.error("Reject vet profile error:", error);
    res.status(500).json({ error: "Server error rejecting vet profile" });
  }
};

// Pet Management
export const getAllPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'pending', 'approved', 'rejected'

    let query = {};
    if (status === 'pending') query.isApproved = false;
    else if (status === 'approved') query.isApproved = true;

    const pets = await Pet.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPets = await Pet.countDocuments(query);

    res.json({
      pets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPets / limit),
        totalPets,
        hasMore: page < Math.ceil(totalPets / limit)
      }
    });
  } catch (error) {
    console.error("Get pets error:", error);
    res.status(500).json({ error: "Server error fetching pets" });
  }
};

export const getPetDetails = async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await Pet.findById(petId)
      .populate({
        path: "owner",
        select: "name email phone address profilePicture type status createdAt"
      })
      .populate("approvedBy", "name email")
      .populate("rejectedBy", "name email");

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json({
      pet: {
        ...pet.toObject(),
        applicationHistory: {
          submittedAt: pet.createdAt,
          approvedAt: pet.approvedAt,
          rejectedAt: pet.rejectedAt,
          approvedBy: pet.approvedBy,
          rejectedBy: pet.rejectedBy,
          rejectionReason: pet.rejectionReason
        }
      }
    });
  } catch (error) {
    console.error("Get pet details error:", error);
    res.status(500).json({ error: "Server error fetching pet details" });
  }
};

export const approvePet = async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await Pet.findByIdAndUpdate(
      petId,
      { isApproved: true, approvedAt: new Date(), approvedBy: req.admin._id },
      { new: true }
    ).populate("owner", "name email");

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json({
      message: "Pet approved successfully",
      pet
    });
  } catch (error) {
    console.error("Approve pet error:", error);
    res.status(500).json({ error: "Server error approving pet" });
  }
};

export const rejectPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { reason } = req.body;

    const pet = await Pet.findByIdAndUpdate(
      petId,
      { 
        isApproved: false,
        rejectedAt: new Date(),
        rejectedBy: req.admin._id,
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    ).populate("owner", "name email");

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json({
      message: "Pet rejected",
      pet
    });
  } catch (error) {
    console.error("Reject pet error:", error);
    res.status(500).json({ error: "Server error rejecting pet" });
  }
};

// Grooming Profile Management
export const getAllGroomingProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'pending', 'approved', 'rejected'

    let query = {};
    if (status === 'pending') query.isApproved = false;
    else if (status === 'approved') query.isApproved = true;

    const groomingProfiles = await GroomingProfile.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalGroomers = await GroomingProfile.countDocuments(query);

    res.json({
      groomingProfiles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalGroomers / limit),
        totalGroomers,
        hasMore: page < Math.ceil(totalGroomers / limit)
      }
    });
  } catch (error) {
    console.error("Get grooming profiles error:", error);
    res.status(500).json({ error: "Server error fetching grooming profiles" });
  }
};

export const getGroomingProfileDetails = async (req, res) => {
  try {
    const { groomingId } = req.params;

    const groomingProfile = await GroomingProfile.findById(groomingId)
      .populate({
        path: "user",
        select: "name email phone address profilePicture type status createdAt"
      })
      .populate("approvedBy", "name email")
      .populate("rejectedBy", "name email");

    if (!groomingProfile) {
      return res.status(404).json({ error: "Grooming profile not found" });
    }

    res.json({
      groomingProfile: {
        ...groomingProfile.toObject(),
        applicationHistory: {
          submittedAt: groomingProfile.createdAt,
          approvedAt: groomingProfile.approvedAt,
          rejectedAt: groomingProfile.rejectedAt,
          approvedBy: groomingProfile.approvedBy,
          rejectedBy: groomingProfile.rejectedBy,
          rejectionReason: groomingProfile.rejectionReason
        }
      }
    });
  } catch (error) {
    console.error("Get grooming profile details error:", error);
    res.status(500).json({ error: "Server error fetching grooming profile details" });
  }
};

export const approveGroomingProfile = async (req, res) => {
  try {
    const { groomingId } = req.params;

    const groomingProfile = await GroomingProfile.findByIdAndUpdate(
      groomingId,
      { isApproved: true, approvedAt: new Date(), approvedBy: req.admin._id },
      { new: true }
    ).populate("user", "name email");

    if (!groomingProfile) {
      return res.status(404).json({ error: "Grooming profile not found" });
    }

    res.json({
      message: "Grooming profile approved successfully",
      groomingProfile
    });
  } catch (error) {
    console.error("Approve grooming profile error:", error);
    res.status(500).json({ error: "Server error approving grooming profile" });
  }
};

export const rejectGroomingProfile = async (req, res) => {
  try {
    const { groomingId } = req.params;
    const { reason } = req.body;

    const groomingProfile = await GroomingProfile.findByIdAndUpdate(
      groomingId,
      { 
        isApproved: false, 
        rejectedAt: new Date(),
        rejectedBy: req.admin._id,
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    ).populate("user", "name email");

    if (!groomingProfile) {
      return res.status(404).json({ error: "Grooming profile not found" });
    }

    res.json({
      message: "Grooming profile rejected",
      groomingProfile
    });
  } catch (error) {
    console.error("Reject grooming profile error:", error);
    res.status(500).json({ error: "Server error rejecting grooming profile" });
  }
};