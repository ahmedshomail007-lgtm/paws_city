import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      enum: ["Dog", "Cat", "Bird", "Rabbit", "Other"],
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
    vaccination: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVolunteer: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      trim: true,
    },
    sellerName: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pet", petSchema);
