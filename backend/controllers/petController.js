import Pet from "../models/Pet.js";

// Add a new pet
export const addPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      dateOfBirth,
      gender,
      medicalHistory,
      vaccination,
      price,
      location,
      sellerName,
      contact,
      isVolunteer,
    } = req.body;

    let imageUrl = null;
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      const { uploadToCloudinary } = await import("../config/cloudinary.js");
      const uploadResult = await uploadToCloudinary(
        req.file.buffer, 
        'paws_city/pets', 
        req.file.originalname
      );
      imageUrl = uploadResult.secure_url;
    }

    const petData = {
      owner: req.user._id, // from authMiddleware
      name,
      species,
      breed,
      age: age ? parseInt(age) : undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      medicalHistory,
      vaccination,
      price: price ? parseFloat(price) : 0,
      isVolunteer: isVolunteer === 'true' || isVolunteer === true,
      location,
      sellerName,
      contact,
      image: imageUrl,
    };

    const pet = new Pet(petData);
    await pet.save();

    res.status(201).json({ message: "Pet added successfully", pet });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all pets for marketplace (public) - only approved paid pets
export const getAllPets = async (req, res) => {
  try {
    // Find pets that are approved AND NOT volunteer AND have price > 0
    const pets = await Pet.find({ 
      isApproved: true,
      $and: [
        { 
          $or: [
            { isVolunteer: false },
            { isVolunteer: { $exists: false } }
          ]
        },
        {
          $or: [
            { price: { $gt: 0 } },
            { price: { $exists: false } }
          ]
        }
      ]
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    console.log(`📦 Marketplace: Found ${pets.length} paid pets (isApproved: true, isVolunteer: false, price > 0)`);
    res.json({ pets });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get volunteer pets (free pets for adoption)
export const getVolunteerPets = async (req, res) => {
  try {
    const pets = await Pet.find({ 
      isApproved: true, 
      $or: [
        { isVolunteer: true },
        { price: 0 }
      ]
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    console.log(`💚 Volunteer: Found ${pets.length} free pets (isApproved: true, isVolunteer: true OR price: 0)`);
    res.json({ pets });
  } catch (error) {
    console.error("Error fetching volunteer pets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's own pets
export const getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ pets });
  } catch (error) {
    console.error("Error fetching user pets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get pet by ID (public for viewing)
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("owner", "name email");
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ pet });
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update pet (only owner can update)
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if user owns this pet
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this pet" });
    }

    const {
      name,
      species,
      breed,
      age,
      dateOfBirth,
      gender,
      medicalHistory,
      vaccination,
      price,
      location,
      sellerName,
      contact,
      status,
      isVolunteer,
    } = req.body;

    // Handle image update
    let newImageUrl = pet.image; // Keep existing image by default
    
    if (req.file) {
      // Upload new image to Cloudinary
      const { uploadToCloudinary } = await import("../config/cloudinary.js");
      const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
      
      const uploadResult = await uploadToCloudinary(
        req.file.buffer, 
        'paws_city/pets', 
        req.file.originalname
      );
      newImageUrl = uploadResult.secure_url;
      
      // Delete old image from Cloudinary if it exists
      if (pet.image && pet.image.includes('cloudinary')) {
        try {
          await deleteCloudinaryImage(pet.image);
          console.log(`✅ Deleted old pet image from Cloudinary`);
        } catch (error) {
          console.log(`⚠️ Could not delete old pet image from Cloudinary:`, error.message);
        }
      }
    }

    const updateData = {
      name: name || pet.name,
      species: species || pet.species,
      breed: breed || pet.breed,
      age: age ? parseInt(age) : pet.age,
      dateOfBirth: dateOfBirth || pet.dateOfBirth,
      gender: gender || pet.gender,
      medicalHistory: medicalHistory || pet.medicalHistory,
      vaccination: vaccination || pet.vaccination,
      price: price !== undefined ? parseFloat(price) : pet.price,
      isVolunteer: isVolunteer !== undefined ? (isVolunteer === 'true' || isVolunteer === true) : pet.isVolunteer,
      location: location || pet.location,
      sellerName: sellerName || pet.sellerName,
      contact: contact || pet.contact,
      status: status || pet.status,
      image: newImageUrl,
    };

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: "Pet updated successfully", pet: updatedPet });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete pet (only owner can delete)
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if user owns this pet
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this pet" });
    }

    // Delete associated image from Cloudinary
    if (pet.image && pet.image.includes('cloudinary')) {
      try {
        const { deleteCloudinaryImage } = await import("../utils/fileUtils.js");
        await deleteCloudinaryImage(pet.image);
        console.log(`✅ Deleted pet image from Cloudinary`);
      } catch (error) {
        console.log(`⚠️ Could not delete pet image from Cloudinary:`, error.message);
      }
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};