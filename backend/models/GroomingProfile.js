import mongoose from "mongoose";

const GroomingProfileSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  businessLicense: { type: String, required: true },
  taxId: { type: String },
  shopImage: { type: String },
  description: { type: String },
  services: { type: [String], default: [] },
  workingHours: { type: String },
  experience: { type: Number },
  priceRange: { type: String },
  specializations: { type: [String], default: [] },
  
  // Link grooming profile to a User
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Approval system
  isApproved: {
    type: Boolean,
    default: undefined,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  approvedAt: {
    type: Date,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
}, { timestamps: true });

const GroomingProfile = mongoose.model("GroomingProfile", GroomingProfileSchema);

export default GroomingProfile;
