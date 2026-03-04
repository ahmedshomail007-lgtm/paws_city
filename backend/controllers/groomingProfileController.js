import GroomingProfile from "../models/GroomingProfile.js";
import { deleteUploadedFile } from "../utils/fileUtils.js";

export const createGroomingProfile = async (req, res) => {
  let shopImageUrl = "";

  try {
    const {
      shopName,
      ownerName,
      email,
      phone,
      address,
      city,
      businessLicense,
      taxId,
      description,
      services,
      workingHours,
      experience,
      priceRange,
      specializations,
    } = req.body;

    if (req.file) {
      const { uploadToCloudinary } = await import("../config/cloudinary.js");
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        'paws_city/grooming',
        req.file.originalname
      );
      shopImageUrl = uploadResult.secure_url;
    }

    let servicesArray = [];
    if (services) {
      if (typeof services === "string") {
        try {
          servicesArray = JSON.parse(services);
        } catch {
          servicesArray = services.split(",").map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(services)) {
        servicesArray = services;
      }
    }

    let specializationsArray = [];
    if (specializations) {
      if (typeof specializations === "string") {
        try {
          specializationsArray = JSON.parse(specializations);
        } catch {
          specializationsArray = specializations.split(",").map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(specializations)) {
        specializationsArray = specializations;
      }
    }

    const newGrooming = new GroomingProfile({
      shopName,
      ownerName,
      email,
      phone,
      address,
      city,
      businessLicense,
      taxId,
      shopImage: shopImageUrl,
      description,
      services: servicesArray,
      workingHours,
      experience,
      priceRange,
      specializations: specializationsArray,
      user: req.user._id,
    });

    await newGrooming.save();
    return res.status(201).json({ message: "Grooming profile created successfully", grooming: newGrooming });
  } catch (error) {
    console.error("Create GroomingProfile error:", error);

    if (shopImageUrl) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(shopImageUrl);
      } catch (deleteError) {
        console.error("Error deleting uploaded image:", deleteError);
      }
    }

    if (error.code === 11000 && error.keyValue?.email) {
      return res.status(400).json({ error: `A profile with the email "${error.keyValue.email}" already exists` });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllGroomingProfiles = async (req, res) => {
  try {
    const groomingProfiles = await GroomingProfile.find({ isApproved: true }).populate("user", "name email");
    res.json({ groomingProfiles });
  } catch (err) {
    console.error("Error fetching grooming profiles:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getGroomingProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const groomingProfile = await GroomingProfile.findById(id).populate("user", "name email");
    
    if (!groomingProfile) {
      return res.status(404).json({ error: "Grooming profile not found" });
    }

    res.json({ groomingProfile });
  } catch (err) {
    console.error("Error fetching grooming profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateGroomingProfile = async (req, res) => {
  let shopImageUrl = "";

  try {
    const { id } = req.params;
    const groomingProfile = await GroomingProfile.findById(id);

    if (!groomingProfile) {
      return res.status(404).json({ error: "Grooming profile not found" });
    }

    if (groomingProfile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to update this profile" });
    }

    const {
      shopName,
      ownerName,
      email,
      phone,
      address,
      city,
      businessLicense,
      taxId,
      description,
      services,
      workingHours,
      experience,
      priceRange,
      specializations,
    } = req.body;

    if (req.file) {
      const { uploadToCloudinary } = await import("../config/cloudinary.js");
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        'paws_city/grooming',
        req.file.originalname
      );
      shopImageUrl = uploadResult.secure_url;

      if (groomingProfile.shopImage) {
        try {
          const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
          await deleteCloudinaryImage(groomingProfile.shopImage);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    }

    let servicesArray = groomingProfile.services;
    if (services !== undefined) {
      if (typeof services === "string") {
        try {
          servicesArray = JSON.parse(services);
        } catch {
          servicesArray = services.split(",").map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(services)) {
        servicesArray = services;
      }
    }

    let specializationsArray = groomingProfile.specializations;
    if (specializations !== undefined) {
      if (typeof specializations === "string") {
        try {
          specializationsArray = JSON.parse(specializations);
        } catch {
          specializationsArray = specializations.split(",").map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(specializations)) {
        specializationsArray = specializations;
      }
    }

    const updateData = {
      shopName: shopName || groomingProfile.shopName,
      ownerName: ownerName || groomingProfile.ownerName,
      email: email || groomingProfile.email,
      phone: phone || groomingProfile.phone,
      address: address || groomingProfile.address,
      city: city || groomingProfile.city,
      businessLicense: businessLicense || groomingProfile.businessLicense,
      taxId: taxId !== undefined ? taxId : groomingProfile.taxId,
      description: description !== undefined ? description : groomingProfile.description,
      services: servicesArray,
      workingHours: workingHours !== undefined ? workingHours : groomingProfile.workingHours,
      experience: experience !== undefined ? experience : groomingProfile.experience,
      priceRange: priceRange !== undefined ? priceRange : groomingProfile.priceRange,
      specializations: specializationsArray,
    };

    if (shopImageUrl) {
      updateData.shopImage = shopImageUrl;
    }

    const updatedGrooming = await GroomingProfile.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "Grooming profile updated successfully", grooming: updatedGrooming });
  } catch (error) {
    console.error("Update GroomingProfile error:", error);

    if (shopImageUrl) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(shopImageUrl);
      } catch (deleteError) {
        console.error("Error deleting uploaded image:", deleteError);
      }
    }

    if (error.code === 11000 && error.keyValue?.email) {
      return res.status(400).json({ error: `A profile with the email "${error.keyValue.email}" already exists` });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteGroomingProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const groomingProfile = await GroomingProfile.findById(id);

    if (!groomingProfile) {
      return res.status(404).json({ error: "Grooming profile not found" });
    }

    if (groomingProfile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this profile" });
    }

    if (groomingProfile.shopImage) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(groomingProfile.shopImage);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    await GroomingProfile.findByIdAndDelete(id);
    res.json({ message: "Grooming profile deleted successfully" });
  } catch (error) {
    console.error("Delete GroomingProfile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
