import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  type: { type: String, enum: ["Pet Owner", "Veterinarian"], default: "Pet Owner" },
  status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
  phone: { type: String, trim: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profilePicture: { type: String }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
