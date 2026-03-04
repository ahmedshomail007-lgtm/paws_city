import mongoose from "mongoose";

const VetProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  govtId: { type: String, required: true },
  degree: { type: String, required: true },
  licenseNo: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  profilePhoto: { type: String },
  clinic: { type: String },
  specialization: { type: String },
  experience: { type: Number },
  services: { type: [String] },
  workingHours: { type: String },

  // 🔥 link vet profile to a User
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

const VetProfile = mongoose.model("VetProfile", VetProfileSchema);

export default VetProfile;
