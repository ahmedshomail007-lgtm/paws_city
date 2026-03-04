import VetProfile from "../models/VetProfile.js";
import { deleteUploadedFile } from "../utils/fileUtils.js";


export const createVetProfile = async (req, res) => {
  let profilePhotoUrl = "";

  try {
    const {
      fullName,
      email,
      phone,
      govtId,
      degree,
      licenseNo,
      issuingAuthority,
      expiryDate,
      clinic,
      specialization,
      experience,
      services,
      workingHours,
    } = req.body;


    if (req.file) {
      const { uploadToCloudinary } = await import("../config/cloudinary.js");
      const uploadResult = await uploadToCloudinary(
        req.file.buffer, 
        'paws_city/vets', 
        req.file.originalname
      );
      profilePhotoUrl = uploadResult.secure_url;
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

    const newVet = new VetProfile({
      fullName,
      email,
      phone,
      govtId,
      degree,
      licenseNo,
      issuingAuthority,
      expiryDate,
      profilePhoto: profilePhotoUrl,
      clinic,
      specialization,
      experience,
      services: servicesArray,
      workingHours,
      user: req.user._id,
    });

    await newVet.save();
    return res.status(201).json({ message: "Vet profile created successfully", vet: newVet });
  } catch (error) {
    console.error("Create VetProfile error:", error);


    if (profilePhotoUrl) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(profilePhotoUrl);
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


export const getAllVets = async (req, res) => {
  try {

    const vets = await VetProfile.find({ isApproved: true }).populate("user", "name email");
    res.status(200).json({ vets });
  } catch (error) {
    console.error("Get all vets error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getVetById = async (req, res) => {
  try {
    const vet = await VetProfile.findById(req.params.id).populate("user", "name email");
    if (!vet) return res.status(404).json({ error: "Vet not found" });

    res.status(200).json({ vet });
  } catch (error) {
    console.error("Get vet by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getVetsByUser = async (req, res) => {
  try {
    const vets = await VetProfile.find({ user: req.params.userId });
    res.status(200).json({ vets });
  } catch (error) {
    console.error("Get vets by user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateVetProfile = async (req, res) => {
  let newProfilePhotoUrl = "";
  let oldProfilePhoto = "";

  try {
    const {
      fullName,
      email,
      phone,
      govtId,
      degree,
      licenseNo,
      issuingAuthority,
      expiryDate,
      clinic,
      specialization,
      experience,
      services,
      workingHours,
    } = req.body;

    const vet = await VetProfile.findById(req.params.id);
    if (!vet) return res.status(404).json({ error: "Vet profile not found" });


    if (vet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    oldProfilePhoto = vet.profilePhoto;


    if (req.file) {
      const { uploadToCloudinary } = await import("../config/cloudinary.js");
      const uploadResult = await uploadToCloudinary(
        req.file.buffer, 
        'paws_city/vets', 
        req.file.originalname
      );
      newProfilePhotoUrl = uploadResult.secure_url;
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

    const updateData = {
      fullName: fullName || vet.fullName,
      email: email || vet.email,
      phone: phone || vet.phone,
      govtId: govtId || vet.govtId,
      degree: degree || vet.degree,
      licenseNo: licenseNo || vet.licenseNo,
      issuingAuthority: issuingAuthority || vet.issuingAuthority,
      expiryDate: expiryDate || vet.expiryDate,
      clinic: clinic || vet.clinic,
      specialization: specialization || vet.specialization,
      experience: experience || vet.experience,
      services: servicesArray.length > 0 ? servicesArray : vet.services,
      workingHours: workingHours || vet.workingHours,
    };

    if (newProfilePhotoUrl) {
      updateData.profilePhoto = newProfilePhotoUrl;
    }

    const updatedVet = await VetProfile.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });


    if (newProfilePhotoUrl && oldProfilePhoto && oldProfilePhoto.includes('cloudinary')) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(oldProfilePhoto);
        console.log(`✅ Deleted old vet profile photo from Cloudinary`);
      } catch (error) {
        console.log(`⚠️ Could not delete old vet profile photo from Cloudinary:`, error.message);
      }
    }

    return res.status(200).json({ message: "Vet profile updated successfully", vet: updatedVet });
  } catch (error) {
    console.error("Update VetProfile error:", error);


    if (newProfilePhotoUrl) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(newProfilePhotoUrl);
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


export const deleteVetProfile = async (req, res) => {
  try {
    const vet = await VetProfile.findById(req.params.id);
    if (!vet) return res.status(404).json({ error: "Vet not found" });

    if (vet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }


    if (vet.profilePhoto && vet.profilePhoto.includes('cloudinary')) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(vet.profilePhoto);
        console.log(`✅ Deleted vet profile photo from Cloudinary`);
      } catch (error) {
        console.log(`⚠️ Could not delete vet profile photo from Cloudinary:`, error.message);
      }
    }

    await vet.deleteOne();
    res.json({ message: "Vet profile deleted successfully" });
  } catch (error) {
    console.error("Delete vet error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
